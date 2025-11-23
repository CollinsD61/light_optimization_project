# Refresh Token Implementation

## 📋 Overview

Implement refresh token mechanism to improve security and user experience.

---

## 🎯 Current Implementation

### Current JWT Flow:
```
User Login
  ↓
Backend generates Access Token (expires: 7 days)
  ↓
Frontend stores token in localStorage
  ↓
User uses token for 7 days
  ↓
Token expires → User must login again
```

### Issues:
- ❌ **Security Risk**: If access token is stolen, attacker has 7 days to exploit
- ❌ **Poor UX**: User must login again every 7 days
- ❌ **No Revocation**: Cannot invalidate tokens before expiry

---

## ✅ Proposed Implementation

### New Flow with Refresh Token:

```
User Login
  ↓
Backend generates 2 tokens:
  ├─ Access Token (expires: 15 minutes) - For API calls
  └─ Refresh Token (expires: 30 days) - For getting new access token
  ↓
Frontend stores both:
  ├─ Access Token → localStorage (or memory)
  └─ Refresh Token → httpOnly cookie (more secure)
  ↓
User calls API → Sends Access Token
  ↓
After 15 minutes → Access Token expires
  ↓
Frontend auto-calls /api/refresh → Sends Refresh Token
  ↓
Backend validates Refresh Token → Returns new Access Token
  ↓
Frontend continues without re-login
```

---

## 🔧 Implementation Plan

### 1. Backend Changes

#### A. Update `authController.js` - Login endpoint
```javascript
// BE_nodejs/src/controllers/authController.js

const login = async (req, res) => {
  // ... existing validation ...
  
  // Generate both tokens
  const accessToken = jwt.sign(
    { id: user.id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: '15m' } // Short-lived
  );
  
  const refreshToken = jwt.sign(
    { id: user.id, type: 'refresh' },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: '30d' } // Long-lived
  );
  
  // Save refresh token to database
  await RefreshToken.create({
    userId: user.id,
    token: refreshToken,
    expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
  });
  
  // Set refresh token as httpOnly cookie
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
  });
  
  // Return access token
  res.json({ 
    accessToken,
    expiresIn: 900 // 15 minutes in seconds
  });
};
```

#### B. Create new endpoint: `/api/refresh`
```javascript
// BE_nodejs/src/controllers/authController.js

const refresh = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    
    if (!refreshToken) {
      return res.status(401).json({ error: 'Refresh token required' });
    }
    
    // Verify refresh token
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    
    // Check if token exists in database (not revoked)
    const storedToken = await RefreshToken.findOne({
      where: { 
        token: refreshToken,
        userId: decoded.id,
        expiresAt: { [Op.gt]: new Date() }
      }
    });
    
    if (!storedToken) {
      return res.status(401).json({ error: 'Invalid refresh token' });
    }
    
    // Generate new access token
    const accessToken = jwt.sign(
      { id: decoded.id, email: decoded.email },
      process.env.JWT_SECRET,
      { expiresIn: '15m' }
    );
    
    res.json({ 
      accessToken,
      expiresIn: 900
    });
    
  } catch (error) {
    res.status(401).json({ error: 'Invalid refresh token' });
  }
};
```

#### C. Create `RefreshToken` model
```javascript
// BE_nodejs/src/models/RefreshToken.js

module.exports = (sequelize, DataTypes) => {
  const RefreshToken = sequelize.define('RefreshToken', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id'
      }
    },
    token: {
      type: DataTypes.TEXT,
      allowNull: false,
      unique: true
    },
    expiresAt: {
      type: DataTypes.DATE,
      allowNull: false
    },
    revokedAt: {
      type: DataTypes.DATE,
      allowNull: true
    }
  });
  
  return RefreshToken;
};
```

#### D. Update `.env`
```bash
JWT_SECRET=your-current-secret
REFRESH_TOKEN_SECRET=your-new-refresh-secret-keep-it-different
```

---

### 2. Frontend Changes

#### A. Create `tokenService.js`
```javascript
// FE/src/services/tokenService.js

let accessToken = null;
let tokenExpiryTime = null;

export const setAccessToken = (token, expiresIn) => {
  accessToken = token;
  tokenExpiryTime = Date.now() + (expiresIn * 1000);
  localStorage.setItem('tokenExpiry', tokenExpiryTime);
};

export const getAccessToken = () => accessToken;

export const clearTokens = () => {
  accessToken = null;
  tokenExpiryTime = null;
  localStorage.removeItem('tokenExpiry');
};

export const isTokenExpiringSoon = () => {
  if (!tokenExpiryTime) return true;
  const timeLeft = tokenExpiryTime - Date.now();
  return timeLeft < 60000; // Less than 1 minute left
};

export const refreshAccessToken = async () => {
  try {
    const response = await fetch(`${BASE_URL}/api/refresh`, {
      method: 'POST',
      credentials: 'include' // Send cookies
    });
    
    if (response.ok) {
      const { accessToken: newToken, expiresIn } = await response.json();
      setAccessToken(newToken, expiresIn);
      return newToken;
    }
    
    // Refresh failed, need to re-login
    clearTokens();
    window.location.href = '/login';
    return null;
    
  } catch (error) {
    console.error('Token refresh failed:', error);
    return null;
  }
};
```

#### B. Create Axios interceptor
```javascript
// FE/src/api.js

import axios from 'axios';
import { getAccessToken, isTokenExpiringSoon, refreshAccessToken } from './services/tokenService';

const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true // Send cookies
});

// Request interceptor - auto refresh if token expiring soon
api.interceptors.request.use(async (config) => {
  if (isTokenExpiringSoon()) {
    await refreshAccessToken();
  }
  
  const token = getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  return config;
});

// Response interceptor - retry on 401
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // If 401 and not already retried
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      const newToken = await refreshAccessToken();
      if (newToken) {
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return api(originalRequest);
      }
    }
    
    return Promise.reject(error);
  }
);

export default api;
```

#### C. Update `LoginPage.jsx`
```javascript
// FE/src/auth/LoginPage.jsx

import { setAccessToken } from '../services/tokenService';

const handleLogin = async (email, password) => {
  const response = await fetch(`${BASE_URL}/api/users/login/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include', // Important! To receive cookies
    body: JSON.stringify({ email, password })
  });
  
  const data = await response.json();
  
  // Store access token in memory (or localStorage)
  setAccessToken(data.accessToken, data.expiresIn);
  
  // Refresh token is stored in httpOnly cookie automatically
  navigate('/mainlayout');
};
```

---

## 📊 Security Benefits

| Aspect | Without Refresh Token | With Refresh Token |
|--------|----------------------|-------------------|
| **Token Lifetime** | 7 days | 15 minutes |
| **If Stolen** | Attacker has 7 days | Attacker has 15 minutes |
| **User Experience** | Re-login every 7 days | Stay logged in 30 days |
| **Token Revocation** | Not possible | Can revoke via database |
| **XSS Attack** | All tokens vulnerable | Only access token vulnerable (refresh token in httpOnly cookie) |

---

## 🔄 Token Rotation (Optional Enhancement)

For even better security, implement **refresh token rotation**:

```javascript
// On refresh, generate NEW refresh token and invalidate old one
const refresh = async (req, res) => {
  // ... existing validation ...
  
  // Generate NEW refresh token
  const newRefreshToken = jwt.sign(/* ... */);
  
  // Invalidate old refresh token
  await RefreshToken.update(
    { revokedAt: new Date() },
    { where: { token: refreshToken } }
  );
  
  // Save new refresh token
  await RefreshToken.create({
    userId: decoded.id,
    token: newRefreshToken,
    expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
  });
  
  // Set new refresh token cookie
  res.cookie('refreshToken', newRefreshToken, {/* ... */});
  
  // Return new access token
  res.json({ accessToken, expiresIn: 900 });
};
```

---

## 📝 Migration Steps

1. ✅ Add `REFRESH_TOKEN_SECRET` to `.env`
2. ✅ Create `RefreshToken` model and migration
3. ✅ Update `authController.js` - add refresh logic
4. ✅ Create `/api/refresh` endpoint
5. ✅ Create `tokenService.js` in frontend
6. ✅ Update `api.js` with interceptors
7. ✅ Update `LoginPage.jsx` to use new token service
8. ✅ Test thoroughly:
   - Login flow
   - Token refresh (wait 15 minutes)
   - Logout flow
   - Token revocation

---

## 🧪 Testing Checklist

- [ ] User can login successfully
- [ ] Access token expires after 15 minutes
- [ ] Frontend auto-refreshes token before expiry
- [ ] User stays logged in for 30 days without re-login
- [ ] Logout clears both tokens
- [ ] Revoked refresh tokens cannot be used
- [ ] Expired refresh tokens are rejected
- [ ] XSS attacks cannot steal refresh token (httpOnly cookie)

---

## 📚 References

- [JWT Best Practices](https://auth0.com/blog/refresh-tokens-what-are-they-and-when-to-use-them/)
- [OWASP JWT Security](https://cheatsheetseries.owasp.org/cheatsheets/JSON_Web_Token_for_Java_Cheat_Sheet.html)
- [express-rate-limit with refresh tokens](https://express-rate-limit.github.io/)

---

## 🎯 Priority

**Medium Priority** - Current implementation works, but refresh token improves:
- Security (shorter access token lifetime)
- UX (longer session without re-login)
- Token management (revocation capability)

**Estimated Time:** 4-6 hours for full implementation

---

**Status:** 📝 Documented  
**Last Updated:** 2025-11-23  
**Author:** AI Assistant

