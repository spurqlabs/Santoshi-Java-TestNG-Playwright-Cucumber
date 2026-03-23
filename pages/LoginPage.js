const BasePage = require('./BasePage');
const locatorReader = require('../utils/locatorReader');
const configManager = require('../utils/configManager');
const Logger = require('../utils/logger');
const assert = require('assert');

/**
 * Login Page Object Model
 * Uses locators from locators.json, config from config.json, and testdata from test-data.json
 */
class LoginPage extends BasePage {
  constructor(page, scenarioContext = null) {
    super(page);
    
    // Load locators from locatorReader
    this.locators = locatorReader.getLoginPageLocators();
    // Store scenario context for data access
    this.scenarioContext = scenarioContext;
  }

  /**
   * Set scenario context
   * @param {object} scenarioContext - Scenario context object
   */
  setScenarioContext(scenarioContext) {
    this.scenarioContext = scenarioContext;
  }

  /**
   * Navigate to login page using config URL
   */
  async navigateToLoginPage() {
    const loginUrl = configManager.getLoginUrl();
    Logger.step(`Navigating to login page: ${loginUrl}`);
    await this.navigateTo(loginUrl);
    Logger.info('Successfully navigated to login page');
  }

  /**
   * Enter username
   * @param {string} username - Username to enter (optional, uses scenarioContext if not provided)
   */
  async enterUsername(username) {
    // If username not provided, get from scenarioContext
    if (!username && this.scenarioContext) {
      username = this.scenarioContext.getData('username');
    }
    if (!username) {
      throw new Error('Username is required for enterUsername method');
    }
    Logger.step(`Entering username: ${username}`);
    await this.fill(this.locators.usernameInput, username);
    Logger.info('Username entered successfully');
  }

  /**
   * Enter password
   * @param {string} password - Password to enter (optional, uses scenarioContext if not provided)
   */
  async enterPassword(password) {
    // If password not provided, get from scenarioContext
    if (!password && this.scenarioContext) {
      password = this.scenarioContext.getData('password');
    }
    if (!password) {
      throw new Error('Password is required for enterPassword method');
    }
    Logger.step('Entering password');
    await this.fill(this.locators.passwordInput, password);
    Logger.info('Password entered successfully');
  }

  /**
   * Click login button
   */
  async clickLoginButton() {
    Logger.step('Clicking login button');
    await this.click(this.locators.loginButton);
    Logger.info('Login button clicked');
  }

  /**
   * Login with credentials
   * @param {string} username - Username (required)
   * @param {string} password - Password (required)
   */
  async login(username, password) {
    if (!username || !password) {
      throw new Error('Username and password are required for login method');
    }
    Logger.info('Starting login process');
    await this.enterUsername(username);
    await this.enterPassword(password);
    await this.clickLoginButton();
    Logger.info('Login process completed');
  }

  /**
   * Get error message
   */
  async getErrorMessage() {
    return await this.getText(this.locators.errorMessage);
  }

  /**
   * Check if login page is displayed
   */
  async isLoginPageDisplayed() {
    return await this.isVisible(this.locators.logo);
  }

  /**
   * Check if dashboard is displayed after login
   */
  async isDashboardDisplayed() {
    const dashboardLocators = locatorReader.getDashboardPageLocators();
    try {
      await this.page.waitForSelector(dashboardLocators.dashboardHeader, { state: 'visible', timeout: 80000 });
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Click forgot password link
   */
  async clickForgotPassword() {
    await this.click(this.locators.forgotPasswordLink);
  }

  /**
   * Get login heading text
   */
  async getLoginHeading() {
    return await this.getText(this.locators.loginHeading);
  }

  /**
   * Check if credentials hint is displayed
   */
  async isCredentialsHintDisplayed() {
    return await this.isVisible(this.locators.credentialsHint);
  }

  /**
   * Wait for login page to load
   */
  async waitForLoginPageLoad() {
    await this.waitForElement(this.locators.usernameInput);
    await this.waitForElement(this.locators.passwordInput);
    await this.waitForElement(this.locators.loginButton);
  }

  /**
   * Verify login page elements
   */
  async verifyLoginPageElements() {
    const isUsernameVisible = await this.isVisible(this.locators.usernameInput);
    const isPasswordVisible = await this.isVisible(this.locators.passwordInput);
    const isLoginButtonVisible = await this.isVisible(this.locators.loginButton);
    const isLogoVisible = await this.isVisible(this.locators.logo);
    
    return {
      usernameInput: isUsernameVisible,
      passwordInput: isPasswordVisible,
      loginButton: isLoginButtonVisible,
      logo: isLogoVisible,
      allElementsPresent: isUsernameVisible && isPasswordVisible && isLoginButtonVisible && isLogoVisible
    };
  }

  // ==================== ASSERTION METHODS ====================

  /**
   * Assert login page is displayed
   * @param {string} message - Custom assertion message
   */
  async assertLoginPageDisplayed(message = 'Login page should be displayed') {
    Logger.assertion(`Asserting login page is displayed`);
    const locator = this.page.locator(this.locators.usernameInput);
    await locator.waitFor({ state: 'visible', timeout: this.timeout });
    const isVisible = await locator.isVisible();
    assert.equal(isVisible, true, message);
    Logger.info('Assertion passed: Login page is displayed');
  }

  /**
   * Assert login page URL is correct
   * @param {string} message - Custom assertion message
   */
  async assertLoginPageUrl(message = 'Login page URL should be correct') {
    Logger.assertion(`Asserting login page URL`);
    const loginUrl = configManager.getLoginUrl();
    const currentUrl = this.page.url();
    assert.ok(currentUrl.includes(loginUrl), message);
    Logger.info(`Assertion passed: Login page URL is correct`);
  }

  /**
   * Assert login page title
   * @param {string} expectedTitle - Expected title (optional, uses config if not provided)
   * @param {string} message - Custom assertion message
   */
  async assertLoginPageTitle(expectedTitle, message = 'Login page title should match') {
    Logger.assertion(`Asserting login page title`);
    if (!expectedTitle) {
      expectedTitle = 'OrangeHRM';
    }
    const actualTitle = await this.page.title();
    assert.ok(actualTitle.includes(expectedTitle), message);
    Logger.info(`Assertion passed: Login page title matches "${expectedTitle}"`);
  }

  /**
   * Assert username input field is visible
   * @param {string} message - Custom assertion message
   */
  async assertUsernameInputVisible(message = 'Username input should be visible') {
    Logger.assertion(`Asserting username input is visible`);
    const locator = this.page.locator(this.locators.usernameInput);
    await locator.waitFor({ state: 'visible', timeout: this.timeout });
    const isVisible = await locator.isVisible();
    assert.equal(isVisible, true, message);
    Logger.info('Assertion passed: Username input is visible');
  }

  /**
   * Assert password input field is visible
   * @param {string} message - Custom assertion message
   */
  async assertPasswordInputVisible(message = 'Password input should be visible') {
    Logger.assertion(`Asserting password input is visible`);
    const locator = this.page.locator(this.locators.passwordInput);
    await locator.waitFor({ state: 'visible', timeout: this.timeout });
    const isVisible = await locator.isVisible();
    assert.equal(isVisible, true, message);
    Logger.info('Assertion passed: Password input is visible');
  }

  /**
   * Assert login button is visible
   * @param {string} message - Custom assertion message
   */
  async assertLoginButtonVisible(message = 'Login button should be visible') {
    Logger.assertion(`Asserting login button is visible`);
    const locator = this.page.locator(this.locators.loginButton);
    await locator.waitFor({ state: 'visible', timeout: this.timeout });
    const isVisible = await locator.isVisible();
    assert.equal(isVisible, true, message);
    Logger.info('Assertion passed: Login button is visible');
  }

  /**
   * Assert login button is enabled
   * @param {string} message - Custom assertion message
   */
  async assertLoginButtonEnabled(message = 'Login button should be enabled') {
    Logger.assertion(`Asserting login button is enabled`);
    const locator = this.page.locator(this.locators.loginButton);
    await locator.waitFor({ state: 'visible', timeout: this.timeout });
    const isEnabled = await locator.isEnabled();
    assert.equal(isEnabled, true, message);
    Logger.info('Assertion passed: Login button is enabled');
  }

  /**
   * Assert logo is visible on login page
   * @param {string} message - Custom assertion message
   */
  async assertLogoVisible(message = 'Logo should be visible on login page') {
    Logger.assertion(`Asserting logo is visible`);
    const locator = this.page.locator(this.locators.logo);
    await locator.waitFor({ state: 'visible', timeout: this.timeout });
    const isVisible = await locator.isVisible();
    assert.equal(isVisible, true, message);
    Logger.info('Assertion passed: Logo is visible');
  }

  /**
   * Assert login heading text
   * @param {string} expectedHeading - Expected heading text (optional)
   * @param {string} message - Custom assertion message
   */
  async assertLoginHeading(expectedHeading, message = 'Login heading should match') {
    Logger.assertion(`Asserting login heading text`);
    const locator = this.page.locator(this.locators.loginHeading);
    await locator.waitFor({ state: 'visible', timeout: this.timeout });
    if (expectedHeading) {
      const actualText = await locator.textContent();
      assert.equal(actualText.trim(), expectedHeading, message);
    } else {
      const isVisible = await locator.isVisible();
      assert.equal(isVisible, true, message);
    }
    Logger.info('Assertion passed: Login heading is correct');
  }

  /**
   * Assert credentials hint is displayed
   * @param {string} message - Custom assertion message
   */
  async assertCredentialsHintDisplayed(message = 'Credentials hint should be displayed') {
    Logger.assertion(`Asserting credentials hint is displayed`);
    const locator = this.page.locator(this.locators.credentialsHint);
    await locator.waitFor({ state: 'visible', timeout: this.timeout });
    const isVisible = await locator.isVisible();
    assert.equal(isVisible, true, message);
    Logger.info('Assertion passed: Credentials hint is displayed');
  }

  /**
   * Assert dashboard is displayed after successful login
   * @param {string} message - Custom assertion message
   */
  async assertDashboardDisplayed(message = 'Dashboard should be displayed after login') {
    Logger.assertion(`Asserting dashboard is displayed`);
    const dashboardLocators = locatorReader.getDashboardPageLocators();
    const locator = this.page.locator(dashboardLocators.dashboardHeader);
    await locator.waitFor({ state: 'visible', timeout: 60000 });
    const isVisible = await locator.isVisible();
    assert.equal(isVisible, true, message);
    Logger.info('Assertion passed: Dashboard is displayed');
  }

  /**
   * Assert dashboard URL after login
   * @param {string} message - Custom assertion message
   */
  async assertDashboardUrl(message = 'URL should contain dashboard after login') {
    Logger.assertion(`Asserting dashboard URL`);
    const currentUrl = this.page.url();
    assert.ok(currentUrl.includes('dashboard'), message);
    Logger.info('Assertion passed: Dashboard URL is correct');
  }

  /**
   * Assert error message is displayed
   * @param {string} message - Custom assertion message
   */
  async assertErrorMessageDisplayed(message = 'Error message should be displayed') {
    Logger.assertion(`Asserting error message is displayed`);
    const locator = this.page.locator(this.locators.errorMessage);
    await locator.waitFor({ state: 'visible', timeout: this.timeout });
    const isVisible = await locator.isVisible();
    assert.equal(isVisible, true, message);
    Logger.info('Assertion passed: Error message is displayed');
  }

  /**
   * Assert error message text
   * @param {string} expectedMessage - Expected error message text
   * @param {string} message - Custom assertion message
   */
  async assertErrorMessageText(expectedMessage, message = 'Error message text should match') {
    Logger.assertion(`Asserting error message text: ${expectedMessage}`);
    const locator = this.page.locator(this.locators.errorMessage);
    await locator.waitFor({ state: 'visible', timeout: this.timeout });
    const actualText = await locator.textContent();
    assert.equal(actualText.trim(), expectedMessage, message);
    Logger.info(`Assertion passed: Error message text matches "${expectedMessage}"`);
  }

  /**
   * Assert error message contains text
   * @param {string} partialText - Partial text to check in error message
   * @param {string} message - Custom assertion message
   */
  async assertErrorMessageContains(partialText, message = 'Error message should contain text') {
    Logger.assertion(`Asserting error message contains: ${partialText}`);
    const locator = this.page.locator(this.locators.errorMessage);
    await locator.waitFor({ state: 'visible', timeout: this.timeout });
    const actualText = await locator.textContent();
    assert.ok(actualText.includes(partialText), message);
    Logger.info(`Assertion passed: Error message contains "${partialText}"`);
  }

  /**
   * Assert forgot password link is visible
   * @param {string} message - Custom assertion message
   */
  async assertForgotPasswordLinkVisible(message = 'Forgot password link should be visible') {
    Logger.assertion(`Asserting forgot password link is visible`);
    const locator = this.page.locator(this.locators.forgotPasswordLink);
    await locator.waitFor({ state: 'visible', timeout: this.timeout });
    const isVisible = await locator.isVisible();
    assert.equal(isVisible, true, message);
    Logger.info('Assertion passed: Forgot password link is visible');
  }

  /**
   * Assert all login page elements are present
   * @param {string} message - Custom assertion message
   */
  async assertAllLoginPageElementsPresent(message = 'All login page elements should be present') {
    Logger.assertion(`Asserting all login page elements are present`);
    await this.assertUsernameInputVisible();
    await this.assertPasswordInputVisible();
    await this.assertLoginButtonVisible();
    await this.assertLogoVisible();
    Logger.info('Assertion passed: All login page elements are present');
  }

  /**
   * Assert login was successful
   * @param {string} message - Custom assertion message
   */
  async assertLoginSuccessful(message = 'Login should be successful') {
    Logger.assertion(`Asserting login was successful`);
    await this.assertDashboardDisplayed();
    await this.assertDashboardUrl();
    Logger.info('Assertion passed: Login was successful');
  }

  /**
   * Assert login failed
   * @param {string} expectedError - Expected error message (optional)
   * @param {string} message - Custom assertion message
   */
  async assertLoginFailed(expectedError, message = 'Login should fail with error message') {
    Logger.assertion(`Asserting login failed`);
    await this.assertErrorMessageDisplayed();
    if (expectedError) {
      await this.assertErrorMessageContains(expectedError);
    }
    Logger.info('Assertion passed: Login failed as expected');
  }

  /**
   * Assert username field is empty
   * @param {string} message - Custom assertion message
   */
  async assertUsernameEmpty(message = 'Username field should be empty') {
    Logger.assertion(`Asserting username field is empty`);
    const locator = this.page.locator(this.locators.usernameInput);
    await locator.waitFor({ state: 'visible', timeout: this.timeout });
    const value = await locator.inputValue();
    assert.equal(value, '', message);
    Logger.info('Assertion passed: Username field is empty');
  }

  /**
   * Assert password field is empty
   * @param {string} message - Custom assertion message
   */
  async assertPasswordEmpty(message = 'Password field should be empty') {
    Logger.assertion(`Asserting password field is empty`);
    const locator = this.page.locator(this.locators.passwordInput);
    await locator.waitFor({ state: 'visible', timeout: this.timeout });
    const value = await locator.inputValue();
    assert.equal(value, '', message);
    Logger.info('Assertion passed: Password field is empty');
  }

  /**
   * Assert username field has specific value
   * @param {string} expectedValue - Expected value
   * @param {string} message - Custom assertion message
   */
  async assertUsernameValue(expectedValue, message = 'Username field should have expected value') {
    Logger.assertion(`Asserting username field value: ${expectedValue}`);
    const locator = this.page.locator(this.locators.usernameInput);
    await locator.waitFor({ state: 'visible', timeout: this.timeout });
    const actualValue = await locator.inputValue();
    assert.equal(actualValue, expectedValue, message);
    Logger.info(`Assertion passed: Username field has value "${expectedValue}"`);
  }
}

module.exports = LoginPage;
