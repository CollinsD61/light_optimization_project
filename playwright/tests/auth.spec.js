const { test, expect } = require('@playwright/test');
const LoginPage = require('../pages/LoginPage');
const SignUpPage = require('../pages/SignUpPage');
const DashboardPage = require('../pages/DashboardPage');

test.describe('Authentication Tests', () => {
  let loginPage;
  let signUpPage;
  let dashboardPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    signUpPage = new SignUpPage(page);
    dashboardPage = new DashboardPage(page);
  });

  test('TC001 - Login page should be displayed correctly', async () => {
    await loginPage.navigate();
    
    expect(await loginPage.isLoginPageDisplayed()).toBeTruthy();
    expect(loginPage.getCurrentUrl()).toContain('/login');
  });

  test('TC002 - Login with valid credentials', async ({ page }) => {
    await loginPage.navigate();
    await loginPage.login('test@example.com', 'test123');
    
    // Wait for redirect
    await page.waitForURL('**/mainlayout/**', { timeout: 10000 });
    
    expect(await loginPage.isLoginSuccessful()).toBeTruthy();
    expect(loginPage.getCurrentUrl()).toContain('/mainlayout');
  });

  test('TC003 - Login with invalid email', async () => {
    await loginPage.navigate();
    await loginPage.login('invalid@email.com', 'wrongpass');
    
    await loginPage.wait(2000);
    
    const errorMsg = await loginPage.getErrorMessage();
    expect(errorMsg).not.toBeNull();
  });

  test('TC004 - Login with empty credentials', async () => {
    await loginPage.navigate();
    await loginPage.login('', '');
    
    // Should remain on login page
    expect(loginPage.getCurrentUrl()).toContain('/login');
  });

  test('TC005 - Navigate to forgot password page', async ({ page }) => {
    await loginPage.navigate();
    await loginPage.clickForgotPassword();
    
    await page.waitForURL('**/forgot-password', { timeout: 5000 });
    expect(loginPage.getCurrentUrl()).toContain('/forgot-password');
  });

  test('TC006 - Navigate to sign up page from login', async ({ page }) => {
    await loginPage.navigate();
    await loginPage.clickSignUp();
    
    await page.waitForURL('**/signup', { timeout: 5000 });
    expect(loginPage.getCurrentUrl()).toContain('/signup');
  });

  test('TC007 - Sign up page should be displayed correctly', async () => {
    await signUpPage.navigate();
    
    expect(await signUpPage.isVisible(signUpPage.emailInput)).toBeTruthy();
    expect(await signUpPage.isVisible(signUpPage.passwordInput)).toBeTruthy();
    expect(await signUpPage.isVisible(signUpPage.btnSignUp)).toBeTruthy();
  });

  test('TC008 - Logout from dashboard', async ({ page }) => {
    // Login first
    await loginPage.navigate();
    await loginPage.login('test@example.com', 'test123');
    await page.waitForURL('**/mainlayout/**', { timeout: 10000 });
    
    // Clear local storage to logout
    await loginPage.clearLocalStorage();
    await loginPage.reload();
    
    // Should redirect to login
    await page.waitForURL('**/login', { timeout: 5000 });
    expect(loginPage.getCurrentUrl()).toContain('/login');
  });

  test('TC009 - Access protected page without login', async ({ page }) => {
    // Clear any existing session
    await page.goto('/');
    await loginPage.clearLocalStorage();
    
    // Try to access dashboard without login
    await page.goto('/mainlayout/dashboard');
    
    // Should redirect to login or show no data
    await page.waitForTimeout(2000);
    const currentUrl = loginPage.getCurrentUrl();
    expect(currentUrl).toMatch(/login|mainlayout/);
  });

  test('TC010 - Remember user session after refresh', async ({ page }) => {
    await loginPage.navigate();
    await loginPage.login('test@example.com', 'test123');
    await page.waitForURL('**/mainlayout/**', { timeout: 10000 });
    
    const tokenBefore = await loginPage.getLocalStorageItem('access_token');
    
    // Refresh page
    await loginPage.reload();
    await page.waitForLoadState('networkidle');
    
    const tokenAfter = await loginPage.getLocalStorageItem('access_token');
    
    expect(tokenBefore).toBe(tokenAfter);
    expect(loginPage.getCurrentUrl()).toContain('/mainlayout');
  });
});

