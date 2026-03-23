const configManager = require('../utils/configManager');
const assert = require('assert');
const Logger = require('../utils/logger');

/**
 * Base Page - Common methods for all page objects
 */
class BasePage {
  constructor(page) {
    this.page = page;
    this.timeout = configManager.getTimeout();
  }

  /**
   * Get Playwright locator from selector string
   * Handles both CSS selectors and Playwright locator methods (getByRole, getByText, etc.)
   * @param {string} selector - Selector string (CSS or Playwright method)
   * @returns {Locator} - Playwright Locator object
   */
  getLocator(selector) {
    // Check if selector is a Playwright locator method
    if (selector.startsWith('getByRole(')) {
      // Parse getByRole('role', { name: 'text' })
      const match = selector.match(/getByRole\(\s*['"]([^'"]+)['"]\s*(?:,\s*\{\s*name\s*:\s*['"]([^'"]+)['"]\s*\})?\s*\)/);
      if (match) {
        const role = match[1];
        const name = match[2];
        if (name) {
          return this.page.getByRole(role, { name: name });
        }
        return this.page.getByRole(role);
      }
    } else if (selector.startsWith('getByText(')) {
      // Parse getByText('text') or getByText('text', { exact: true })
      const match = selector.match(/getByText\(\s*['"]([^'"]+)['"]\s*(?:,\s*\{\s*exact\s*:\s*(true|false)\s*\})?\s*\)/);
      if (match) {
        const text = match[1];
        const exact = match[2] === 'true';
        if (exact) {
          return this.page.getByText(text, { exact: true });
        }
        return this.page.getByText(text);
      }
    } else if (selector.startsWith('getByLabel(')) {
      // Parse getByLabel('label')
      const match = selector.match(/getByLabel\(\s*['"]([^'"]+)['"]\s*\)/);
      if (match) {
        return this.page.getByLabel(match[1]);
      }
    } else if (selector.startsWith('getByPlaceholder(')) {
      // Parse getByPlaceholder('placeholder')
      const match = selector.match(/getByPlaceholder\(\s*['"]([^'"]+)['"]\s*\)/);
      if (match) {
        return this.page.getByPlaceholder(match[1]);
      }
    } else if (selector.startsWith('getByTestId(')) {
      // Parse getByTestId('testId')
      const match = selector.match(/getByTestId\(\s*['"]([^'"]+)['"]\s*\)/);
      if (match) {
        return this.page.getByTestId(match[1]);
      }
    } else if (selector.startsWith('getByTitle(')) {
      // Parse getByTitle('title')
      const match = selector.match(/getByTitle\(\s*['"]([^'"]+)['"]\s*\)/);
      if (match) {
        return this.page.getByTitle(match[1]);
      }
    } else if (selector.startsWith('getByAltText(')) {
      // Parse getByAltText('altText')
      const match = selector.match(/getByAltText\(\s*['"]([^'"]+)['"]\s*\)/);
      if (match) {
        return this.page.getByAltText(match[1]);
      }
    }
    
    // Default: use as CSS selector
    return this.page.locator(selector);
  }

  /**
   * Navigate to URL
   */
  async navigateTo(url) {
    await this.page.goto(url, { waitUntil: 'networkidle' });
  }

  /**
   * Wait for element to be visible
   */
  async waitForElement(selector) {
    await this.getLocator(selector).waitFor({ state: 'visible', timeout: this.timeout });
  }

  /**
   * Click on element
   */
  async click(selector) {
    await this.waitForElement(selector);
    await this.page.click(selector);
  }

  /**
   * Fill text field
   */
  async fill(selector, value) {
    await this.waitForElement(selector);
    await this.page.fill(selector, value);
  }

  /**
   * Get text from element
   */
  async getText(selector) {
    await this.waitForElement(selector);
    return await this.page.textContent(selector);
  }

  /**
   * Check if element is visible
   */
  async isVisible(selector) {
    try {
      await this.page.waitForSelector(selector, { state: 'visible', timeout: 5000 });
      return true;
    } catch {
      return false;
    }
  }

  // ==================== COMMON ASSERTION METHODS ====================

  /**
   * Assert element is visible
   * @param {string} selector - Element selector
   * @param {string} message - Custom assertion message
   */
  async assertElementVisible(selector, message = 'Element should be visible') {
    Logger.assertion(`Asserting element is visible: ${selector}`);
    const locator = this.page.locator(selector);
    await locator.waitFor({ state: 'visible', timeout: this.timeout });
    const isVisible = await locator.isVisible();
    assert.equal(isVisible, true, message);
    Logger.info(`Assertion passed: Element "${selector}" is visible`);
  }

  /**
   * Assert element is not visible
   * @param {string} selector - Element selector
   * @param {string} message - Custom assertion message
   */
  async assertElementNotVisible(selector, message = 'Element should not be visible') {
    Logger.assertion(`Asserting element is not visible: ${selector}`);
    const locator = this.page.locator(selector);
    const isVisible = await locator.isVisible().catch(() => false);
    assert.equal(isVisible, false, message);
    Logger.info(`Assertion passed: Element "${selector}" is not visible`);
  }

  /**
   * Assert element is enabled
   * @param {string} selector - Element selector
   * @param {string} message - Custom assertion message
   */
  async assertElementEnabled(selector, message = 'Element should be enabled') {
    Logger.assertion(`Asserting element is enabled: ${selector}`);
    const locator = this.page.locator(selector);
    await locator.waitFor({ state: 'visible', timeout: this.timeout });
    const isEnabled = await locator.isEnabled();
    assert.equal(isEnabled, true, message);
    Logger.info(`Assertion passed: Element "${selector}" is enabled`);
  }

  /**
   * Assert element is disabled
   * @param {string} selector - Element selector
   * @param {string} message - Custom assertion message
   */
  async assertElementDisabled(selector, message = 'Element should be disabled') {
    Logger.assertion(`Asserting element is disabled: ${selector}`);
    const locator = this.page.locator(selector);
    await locator.waitFor({ state: 'visible', timeout: this.timeout });
    const isDisabled = await locator.isDisabled();
    assert.equal(isDisabled, true, message);
    Logger.info(`Assertion passed: Element "${selector}" is disabled`);
  }

  /**
   * Assert element text equals expected value
   * @param {string} selector - Element selector
   * @param {string} expectedText - Expected text value
   * @param {string} message - Custom assertion message
   */
  async assertElementText(selector, expectedText, message = 'Element text should match') {
    Logger.assertion(`Asserting element text: ${expectedText}`);
    const locator = this.page.locator(selector);
    await locator.waitFor({ state: 'visible', timeout: this.timeout });
    const actualText = await locator.textContent();
    assert.equal(actualText.trim(), expectedText, message);
    Logger.info(`Assertion passed: Element text matches "${expectedText}"`);
  }

  /**
   * Assert element text contains expected value
   * @param {string} selector - Element selector
   * @param {string} expectedText - Expected text to contain
   * @param {string} message - Custom assertion message
   */
  async assertElementContainsText(selector, expectedText, message = 'Element should contain text') {
    Logger.assertion(`Asserting element contains text: ${expectedText}`);
    const locator = this.page.locator(selector);
    await locator.waitFor({ state: 'visible', timeout: this.timeout });
    const actualText = await locator.textContent();
    assert.ok(actualText.includes(expectedText), message);
    Logger.info(`Assertion passed: Element contains "${expectedText}"`);
  }

  /**
   * Assert input field value equals expected value
   * @param {string} selector - Input element selector
   * @param {string} expectedValue - Expected input value
   * @param {string} message - Custom assertion message
   */
  async assertInputValue(selector, expectedValue, message = 'Input value should match') {
    Logger.assertion(`Asserting input value: ${expectedValue}`);
    const locator = this.page.locator(selector);
    await locator.waitFor({ state: 'visible', timeout: this.timeout });
    const actualValue = await locator.inputValue();
    assert.equal(actualValue, expectedValue, message);
    Logger.info(`Assertion passed: Input value matches "${expectedValue}"`);
  }

  /**
   * Assert input field is empty
   * @param {string} selector - Input element selector
   * @param {string} message - Custom assertion message
   */
  async assertInputEmpty(selector, message = 'Input field should be empty') {
    Logger.assertion(`Asserting input field is empty`);
    const locator = this.page.locator(selector);
    await locator.waitFor({ state: 'visible', timeout: this.timeout });
    const value = await locator.inputValue();
    assert.equal(value, '', message);
    Logger.info('Assertion passed: Input field is empty');
  }

  /**
   * Assert URL equals expected value
   * @param {string} expectedUrl - Expected URL
   * @param {string} message - Custom assertion message
   */
  async assertUrl(expectedUrl, message = 'URL should match') {
    Logger.assertion(`Asserting URL: ${expectedUrl}`);
    const actualUrl = this.page.url();
    assert.equal(actualUrl, expectedUrl, message);
    Logger.info(`Assertion passed: URL matches "${expectedUrl}"`);
  }

  /**
   * Assert URL contains expected path
   * @param {string} expectedPath - Expected URL path
   * @param {string} message - Custom assertion message
   */
  async assertUrlContains(expectedPath, message = 'URL should contain path') {
    Logger.assertion(`Asserting URL contains: ${expectedPath}`);
    const actualUrl = this.page.url();
    assert.ok(actualUrl.includes(expectedPath), message);
    Logger.info(`Assertion passed: URL contains "${expectedPath}"`);
  }

  /**
   * Assert page title equals expected value
   * @param {string} expectedTitle - Expected page title
   * @param {string} message - Custom assertion message
   */
  async assertTitle(expectedTitle, message = 'Page title should match') {
    Logger.assertion(`Asserting page title: ${expectedTitle}`);
    const actualTitle = await this.page.title();
    assert.equal(actualTitle, expectedTitle, message);
    Logger.info(`Assertion passed: Page title matches "${expectedTitle}"`);
  }

  /**
   * Assert page title contains expected text
   * @param {string} expectedText - Expected title text
   * @param {string} message - Custom assertion message
   */
  async assertTitleContains(expectedText, message = 'Page title should contain text') {
    Logger.assertion(`Asserting page title contains: ${expectedText}`);
    const actualTitle = await this.page.title();
    assert.ok(actualTitle.includes(expectedText), message);
    Logger.info(`Assertion passed: Page title contains "${expectedText}"`);
  }

  /**
   * Assert element count equals expected value
   * @param {string} selector - Element selector
   * @param {number} expectedCount - Expected count
   * @param {string} message - Custom assertion message
   */
  async assertElementCount(selector, expectedCount, message = 'Element count should match') {
    Logger.assertion(`Asserting element count: ${expectedCount}`);
    const locator = this.page.locator(selector);
    const count = await locator.count();
    assert.equal(count, expectedCount, message);
    Logger.info(`Assertion passed: Element count is ${expectedCount}`);
  }

  /**
   * Assert element has specific attribute value
   * @param {string} selector - Element selector
   * @param {string} attribute - Attribute name
   * @param {string} expectedValue - Expected attribute value
   * @param {string} message - Custom assertion message
   */
  async assertElementAttribute(selector, attribute, expectedValue, message = 'Element attribute should match') {
    Logger.assertion(`Asserting element attribute ${attribute}: ${expectedValue}`);
    const locator = this.page.locator(selector);
    await locator.waitFor({ state: 'visible', timeout: this.timeout });
    const actualValue = await locator.getAttribute(attribute);
    assert.equal(actualValue, expectedValue, message);
    Logger.info(`Assertion passed: Element attribute "${attribute}" matches "${expectedValue}"`);
  }

  /**
   * Assert checkbox is checked
   * @param {string} selector - Checkbox selector
   * @param {string} message - Custom assertion message
   */
  async assertCheckboxChecked(selector, message = 'Checkbox should be checked') {
    Logger.assertion(`Asserting checkbox is checked`);
    const locator = this.page.locator(selector);
    await locator.waitFor({ state: 'visible', timeout: this.timeout });
    const isChecked = await locator.isChecked();
    assert.equal(isChecked, true, message);
    Logger.info('Assertion passed: Checkbox is checked');
  }

  /**
   * Assert checkbox is unchecked
   * @param {string} selector - Checkbox selector
   * @param {string} message - Custom assertion message
   */
  async assertCheckboxUnchecked(selector, message = 'Checkbox should be unchecked') {
    Logger.assertion(`Asserting checkbox is unchecked`);
    const locator = this.page.locator(selector);
    await locator.waitFor({ state: 'visible', timeout: this.timeout });
    const isChecked = await locator.isChecked();
    assert.equal(isChecked, false, message);
    Logger.info('Assertion passed: Checkbox is unchecked');
  }

  /**
   * Assert two values are equal
   * @param {any} actual - Actual value
   * @param {any} expected - Expected value
   * @param {string} message - Custom assertion message
   */
  async assertEqual(actual, expected, message = 'Values should be equal') {
    Logger.assertion(`Asserting equality: ${expected}`);
    assert.equal(actual, expected, message);
    Logger.info(`Assertion passed: Values are equal`);
  }

  /**
   * Assert two values are not equal
   * @param {any} actual - Actual value
   * @param {any} expected - Expected value
   * @param {string} message - Custom assertion message
   */
  async assertNotEqual(actual, expected, message = 'Values should not be equal') {
    Logger.assertion(`Asserting inequality`);
    assert.notEqual(actual, expected, message);
    Logger.info('Assertion passed: Values are not equal');
  }

  /**
   * Assert condition is true
   * @param {boolean} condition - Condition to check
   * @param {string} message - Custom assertion message
   */
  async assertTrue(condition, message = 'Condition should be true') {
    Logger.assertion(`Asserting condition is true`);
    assert.equal(condition, true, message);
    Logger.info('Assertion passed: Condition is true');
  }

  /**
   * Assert condition is false
   * @param {boolean} condition - Condition to check
   * @param {string} message - Custom assertion message
   */
  async assertFalse(condition, message = 'Condition should be false') {
    Logger.assertion(`Asserting condition is false`);
    assert.equal(condition, false, message);
    Logger.info('Assertion passed: Condition is false');
  }
}

module.exports = BasePage;
