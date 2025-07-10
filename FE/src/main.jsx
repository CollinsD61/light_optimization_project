import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';

// 1. Import thư viện của Google 
import { GoogleOAuthProvider } from '@react-oauth/google';

// 2. Lấy Client ID từ file .env
const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

const root = createRoot(document.getElementById('root'));

root.render(
  <StrictMode>
    {/* 3. Bọc toàn bộ App bằng GoogleOAuthProvider và truyền vào Client ID */}
    <GoogleOAuthProvider clientId={googleClientId}>
      <App />
    </GoogleOAuthProvider>
  </StrictMode>,
);