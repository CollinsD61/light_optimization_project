const BasePage = require('./BasePage');

/**
 * SignUpPage - Page Object for Sign Up page
 */
class SignUpPage extends BasePage {
  constructor(page) {
    super(page);
    
    // Locators - Based on actual findings
    this.emailInput = 'input#email[type="email"][name="email"]';
    this.passwordInput = 'input#password[type="password"][name="password"]';
    this.confirmPasswordInput = 'input[name="confirmPassword"], input[placeholder*="Nhập lại"]';
    this.btnSignUp = 'button[type="submit"]:has-text("Đăng ký tài khoản")';
    this.btnShowPassword = 'button[type="button"]'; // Eye icon
    this.linkLogin = 'a:has-text("Đăng nhập")';
    this.errorMessage = '.text-red-500, [role="alert"]';
    this.successMessage = '.success';
  }

  /**
   * Navigate to sign up page
   */
  async navigate() {
    await this.goto('/signup');
    await this.waitForElement(this.emailInput);
  }

  /**
   * Sign up with email and password
   * @param {string} email - User email
   * @param {string} password - User password
   * @param {string} confirmPassword - Confirm password
   */
  async signUp(email, password, confirmPassword = password) {
    await this.fill(this.emailInput, email);
    await this.fill(this.passwordInput, password);
    
    if (await this.isVisible(this.confirmPasswordInput)) {
      await this.fill(this.confirmPasswordInput, confirmPassword);
    }
    
    await this.click(this.btnSignUp);
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
   * Get success message
   * @returns {Promise<string|null>}
   */
  async getSuccessMessage() {
    if (await this.isVisible(this.successMessage)) {
      return await this.getText(this.successMessage);
    }
    return null;
  }

  /**
   * Click login link
   */
  async clickLogin() {
    await this.click(this.linkLogin);
  }
}

module.exports = SignUpPage;

