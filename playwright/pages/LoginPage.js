const BasePage = require('./BasePage');

/**
 * LoginPage - Page Object for Login page
 */
class LoginPage extends BasePage {
  constructor(page) {
    super(page);
    
    // Locators
    this.emailInput = 'input[type="email"]';
    this.passwordInput = 'input[type="password"]';
    this.btnLogin = 'button[type="submit"]';
    this.btnGoogleLogin = 'button:has-text("Google")';
    this.linkForgotPassword = 'a:has-text("Quên mật khẩu")';
    this.linkSignUp = 'a:has-text("Đăng ký")';
    this.errorMessage = '.error, [role="alert"]';
    this.successMessage = '.success';
  }

  /**
   * Navigate to login page
   */
  async navigate() {
    await this.goto('/login');
    await this.waitForElement(this.emailInput);
  }

  /**
   * Login with email and password
   * @param {string} email - User email
   * @param {string} password - User password
   */
  async login(email, password) {
    await this.fill(this.emailInput, email);
    await this.fill(this.passwordInput, password);
    await this.click(this.btnLogin);
  }

  /**
   * Check if login was successful by checking for access token
   * @returns {Promise<boolean>}
   */
  async isLoginSuccessful() {
    await this.wait(2000); // Wait for token to be set
    const token = await this.getLocalStorageItem('access_token');
    return token !== null && token !== '';
  }

  /**
   * Get error message
   * @returns {Promise<string|null>}
   */
  async getErrorMessage() {
    if (await this.isVisible(this.errorMessage)) {
      return await this.getText(this.errorMessage);
    }
    return null;
  }

  /**
   * Click forgot password link
   */
  async clickForgotPassword() {
    await this.click(this.linkForgotPassword);
  }

  /**
   * Click sign up link
   */
  async clickSignUp() {
    await this.click(this.linkSignUp);
  }

  /**
   * Click Google login button
   */
  async clickGoogleLogin() {
    await this.click(this.btnGoogleLogin);
  }

  /**
   * Verify login page is displayed
   * @returns {Promise<boolean>}
   */
  async isLoginPageDisplayed() {
    return await this.isVisible(this.emailInput) && 
           await this.isVisible(this.passwordInput) && 
           await this.isVisible(this.btnLogin);
  }
}

module.exports = LoginPage;

