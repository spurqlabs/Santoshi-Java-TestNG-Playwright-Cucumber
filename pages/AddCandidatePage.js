const BasePage = require('./BasePage');
const locatorReader = require('../utils/locatorReader');
const Logger = require('../utils/logger');
const assert = require('assert');

/**
 * Add Candidate Page Object Model
 * Uses locators from recruit_locators.json and testdata from recruitment.json
 */
class AddCandidatePage extends BasePage {
  constructor(page, scenarioContext = null) {
    super(page);
    
    // Load locators from locatorReader
    this.locators = locatorReader.getAddCandidatePageLocators();
    this.viewCandidatesLocators = locatorReader.getViewCandidatesPageLocators();
    this.recruitmentMenuLocator = locatorReader.getRecruitmentMenuLocator();
    this.commonLocators = locatorReader.getCommonLocatorsRecruitment();
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
   * Helper method to get selector string from locator (handles both string and object formats)
   * @param {string|object} locator - Locator string or object with selector property
   * @returns {string} - Selector string
   */
  getSelector(locator) {
    return typeof locator === 'string' ? locator : locator?.selector;
  }

  // ==================== NAVIGATION METHODS ====================

  /**
   * Click on Recruitment menu from dashboard
   */
  async clickRecruitmentMenu() {
    Logger.step('Clicking on Recruitment menu');
    const selector = typeof this.recruitmentMenuLocator === 'string' 
      ? this.recruitmentMenuLocator 
      : this.recruitmentMenuLocator.selector;
    await this.getLocator(selector).click();
    Logger.info('Recruitment menu clicked');
  }

  /**
   * Navigate to View Candidates page
   */
  async navigateToViewCandidatesPage() {
    Logger.step('Navigating to View Candidates page');
    await this.clickRecruitmentMenu();
    await this.waitForElement(this.getSelector(this.viewCandidatesLocators.candidatesHeading));
    Logger.info('Successfully navigated to View Candidates page');
  }

  /**
   * Click on Add button to navigate to Add Candidate page
   */
  async clickAddButton() {
    Logger.step('Clicking on Add button');
    const selector = this.getSelector(this.viewCandidatesLocators.addButton);
    await this.getLocator(selector).click();
    Logger.info('Add button clicked');
  }

  /**
   * Navigate to Add Candidate page
   */
  async navigateToAddCandidatePage() {
    Logger.step('Navigating to Add Candidate page');
    await this.clickAddButton();
    await this.waitForElement(this.getSelector(this.locators.addCandidateHeading));
    Logger.info('Successfully navigated to Add Candidate page');
  }

  // ==================== FORM FILL METHODS ====================

  /**
   * Enter First Name
   * @param {string} firstName - First name to enter (optional, uses scenarioContext if not provided)
   */
  async enterFirstName(firstName) {
    // If firstName not provided, get from scenarioContext
    if (!firstName && this.scenarioContext) {
      firstName = this.scenarioContext.getData('firstname');
    }
    if (!firstName) {
      throw new Error('First Name is required for enterFirstName method');
    }
    Logger.step(`Entering First Name: ${firstName}`);
    const selector = this.getSelector(this.locators.firstNameInput);
    await this.getLocator(selector).fill(firstName);
    Logger.info('First Name entered successfully');
  }

  /**
   * Enter Middle Name
   * @param {string} middleName - Middle name to enter (optional, uses scenarioContext if not provided)
   */
  async enterMiddleName(middleName) {
    // If middleName not provided, get from scenarioContext
    if (!middleName && this.scenarioContext) {
      middleName = this.scenarioContext.getData('middlename');
    }
    Logger.step(`Entering Middle Name: ${middleName}`);
    const selector = this.getSelector(this.locators.middleNameInput);
    await this.getLocator(selector).fill(middleName);
    Logger.info('Middle Name entered successfully');
  }

  /**
   * Enter Last Name
   * @param {string} lastName - Last name to enter (optional, uses scenarioContext if not provided)
   */
  async enterLastName(lastName) {
    // If lastName not provided, get from scenarioContext
    if (!lastName && this.scenarioContext) {
      lastName = this.scenarioContext.getData('lastname');
    }
    if (!lastName) {
      throw new Error('Last Name is required for enterLastName method');
    }
    Logger.step(`Entering Last Name: ${lastName}`);
    const selector = this.getSelector(this.locators.lastNameInput);
    await this.getLocator(selector).fill(lastName);
    Logger.info('Last Name entered successfully');
  }

  /**
   * Select Job Vacancy from dropdown
   * @param {string} jobVacancy - Job vacancy to select (optional, uses scenarioContext if not provided)
   */
  async selectJobVacancy(jobVacancy) {
    // If jobVacancy not provided, get from scenarioContext
    if (!jobVacancy && this.scenarioContext) {
      jobVacancy = this.scenarioContext.getData('jobvacancy');
    }
    if (!jobVacancy) {
      throw new Error('Job Vacancy is required for selectJobVacancy method');
    }
    Logger.step(`Selecting Job Vacancy: ${jobVacancy}`);
    
    // Wait for the Add Candidate page to be fully loaded
    await this.waitForAddCandidatePageLoad();
    
    // Find the vacancy dropdown by looking for the label "Job Vacancy" and then finding the dropdown in the same grid item
    // Using Playwright's locator filter with hasText
    try {
      // Approach 1: Find the grid item that contains "Job Vacancy" label, then find the dropdown inside
      const vacancyDropdown = this.page.locator('.oxd-grid-item').filter({ has: this.page.locator('.oxd-label', { hasText: 'Job Vacancy' }) }).locator('.oxd-select-text');
      
      // Wait for the dropdown to be visible and click it
      await vacancyDropdown.waitFor({ state: 'visible', timeout: 10000 });
      await vacancyDropdown.click();
      Logger.info('Vacancy dropdown clicked using label filter');
    } catch (e) {
      // Fallback: try alternative approach - find all dropdowns and click the first one
      Logger.info(`Primary selector failed: ${e.message}, trying alternative selector`);
      const altSelector = ".oxd-select-text";
      const dropdowns = await this.page.locator(altSelector).count();
      Logger.info(`Found ${dropdowns} dropdowns on page`);
      
      if (dropdowns > 0) {
        // Click the first dropdown that's visible (should be the vacancy dropdown on Add Candidate page)
        await this.page.locator(altSelector).first().click();
        Logger.info('Clicked first dropdown using fallback');
      } else {
        throw new Error('No dropdown found on Add Candidate page');
      }
    }
    
    // Wait for dropdown options to appear and select the matching option
    await this.page.waitForTimeout(500); // Small wait for dropdown animation
    const optionSelector = this.getSelector(this.commonLocators.dropdownOption);
    await this.getLocator(optionSelector).filter({ hasText: jobVacancy }).click();
    Logger.info('Job Vacancy selected successfully');
  }

  /**
   * Enter Email
   * @param {string} email - Email to enter (optional, uses scenarioContext if not provided)
   */
  async enterEmail(email) {
    // If email not provided, get from scenarioContext
    if (!email && this.scenarioContext) {
      email = this.scenarioContext.getData('email');
    }
    if (!email) {
      throw new Error('Email is required for enterEmail method');
    }
    Logger.step(`Entering Email: ${email}`);
    
    // Find the email input by looking for the label "E-Mail" and then finding the input in the same grid item
    try {
      // Approach 1: Find the grid item that contains "E-Mail" label, then find the input inside
      const emailInput = this.page.locator('.oxd-grid-item').filter({ has: this.page.locator('.oxd-label', { hasText: 'Email' }) }).locator('.oxd-input');
      
      await emailInput.waitFor({ state: 'visible', timeout: 10000 });
      await emailInput.fill(email);
      Logger.info('Email entered successfully using label filter');
    } catch (e) {
      // Fallback: try using getByRole with label
      Logger.info(`Primary selector failed: ${e.message}, trying alternative selector`);
      await this.page.getByRole('textbox', { name: 'Email' }).fill(email);
      Logger.info('Email entered successfully using role selector');
    }
  }

  /**
   * Enter Contact Number
   * @param {string} contactNumber - Contact number to enter (optional, uses scenarioContext if not provided)
   */
  async enterContactNumber(contactNumber) {
    // If contactNumber not provided, get from scenarioContext
    if (!contactNumber && this.scenarioContext) {
      contactNumber = this.scenarioContext.getData('cnumber');
    }
    if (!contactNumber) {
      throw new Error('Contact Number is required for enterContactNumber method');
    }
    Logger.step(`Entering Contact Number: ${contactNumber}`);
    
    // Find the contact number input by looking for the label and then finding the input in the same grid item
    try {
      // Approach 1: Find the grid item that contains contact number label, then find the input inside
      const contactInput = this.page.locator('.oxd-grid-item').filter({ has: this.page.locator('.oxd-label', { hasText: 'Contact' }) }).locator('.oxd-input');
      
      await contactInput.waitFor({ state: 'visible', timeout: 10000 });
      await contactInput.fill(contactNumber);
      Logger.info('Contact Number entered successfully using label filter');
    } catch (e) {
      // Fallback: try alternative approach - find all inputs and use the appropriate one
      Logger.info(`Primary selector failed: ${e.message}, trying alternative selector`);
      // Get all input fields in the form and find the one for contact number
      const inputs = this.page.locator('.oxd-grid-item .oxd-input');
      const count = await inputs.count();
      Logger.info(`Found ${count} input fields on page`);
      
      // The contact number is typically the last input in the same grid item as email
      // Try to find it by getting all inputs and using the appropriate index
      if (count >= 2) {
        await inputs.nth(count - 1).fill(contactNumber);
        Logger.info('Contact Number entered using fallback');
      } else {
        throw new Error('Could not find contact number input field');
      }
    }
  }

  /**
   * Upload Resume file
   * @param {string} filePath - Path to the resume file (optional, uses scenarioContext if not provided)
   */
  async uploadResume(filePath) {
    // If filePath not provided, get from scenarioContext
    if (!filePath && this.scenarioContext) {
      filePath = this.scenarioContext.getData('filePath');
    }
    if (!filePath) {
      throw new Error('File path is required for uploadResume method');
    }
    Logger.step(`Uploading Resume from: ${filePath}`);
    const selector = this.getSelector(this.locators.resumeUpload);
    await this.getLocator(selector).setInputFiles(filePath);
    Logger.info('Resume uploaded successfully');
  }

  
  // ==================== ACTION METHODS ====================

  /**
   * Click Save button
   */
  async clickSaveButton() {
    Logger.step('Clicking Save button');
    const selector = this.getSelector(this.locators.saveButton);
    await this.getLocator(selector).click();
    Logger.info('Save button clicked');
  }

  /**
   * Click Save button and wait for the page to settle
   * @param {number} waitTimeMs - Time to wait after saving in milliseconds (default: 5000ms)
   */
  async clickSaveButtonAndWait(waitTimeMs = 5000) {
    Logger.step('Clicking Save button and waiting');
    await this.clickSaveButton();
    Logger.info(`Waiting for ${waitTimeMs}ms after saving...`);
    await this.page.waitForTimeout(waitTimeMs);
    Logger.info('Wait completed');
  }

  

  // ==================== COMPOSITE METHODS ====================

  /**
   * Add candidate with all required details
   * @param {object} candidateData - Candidate data object
   * @param {string} candidateData.firstname - First name
   * @param {string} candidateData.lastname - Last name
   * @param {string} candidateData.jobvacancy - Job vacancy
   * @param {string} candidateData.email - Email
   * @param {string} candidateData.cnumber - Contact number
   * @param {string} candidateData.filePath - Resume file path
   */
  async addCandidate(candidateData) {
    Logger.info('Starting add candidate process');
    
    await this.enterFirstName(candidateData.firstname);
    await this.enterLastName(candidateData.lastname);
    await this.selectJobVacancy(candidateData.jobvacancy);
    await this.enterEmail(candidateData.email);
    await this.enterContactNumber(candidateData.cnumber);
    
    if (candidateData.filePath) {
      await this.uploadResume(candidateData.filePath);
    }
    
    await this.clickSaveButton();
    Logger.info('Add candidate process completed');
  }

  /**
   * Complete flow from dashboard to adding candidate
   * @param {object} candidateData - Candidate data object
   */
  async completeAddCandidateFlow(candidateData) {
    Logger.info('Starting complete add candidate flow');
    
    await this.navigateToViewCandidatesPage();
    await this.navigateToAddCandidatePage();
    await this.addCandidate(candidateData);
    
    Logger.info('Complete add candidate flow finished');
  }

  // ==================== WAIT METHODS ====================

  /**
   * Wait for Add Candidate page to load
   */
  async waitForAddCandidatePageLoad() {
    await this.waitForElement(this.getSelector(this.locators.addCandidateHeading));
    await this.waitForElement(this.getSelector(this.locators.firstNameInput));
    await this.waitForElement(this.getSelector(this.locators.lastNameInput));
    await this.waitForElement(this.getSelector(this.locators.saveButton));
  }

  /**
   * Wait for View Candidates page to load
   */
  async waitForViewCandidatesPageLoad() {
    await this.waitForElement(this.getSelector(this.viewCandidatesLocators.candidatesHeading));
    await this.waitForElement(this.getSelector(this.viewCandidatesLocators.addButton));
  }

  // ==================== VISIBILITY CHECK METHODS ====================

  /**
   * Check if Add Candidate page is displayed
   */
  async isAddCandidatePageDisplayed() {
    try {
      const selector = this.getSelector(this.locators.addCandidateHeading);
      await this.getLocator(selector).waitFor({ state: 'visible', timeout: 10000 });
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Check if View Candidates page is displayed
   */
  async isViewCandidatesPageDisplayed() {
    try {
      const selector = this.getSelector(this.viewCandidatesLocators.candidatesHeading);
      await this.getLocator(selector).waitFor({ state: 'visible', timeout: 10000 });
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Check if success toast is displayed
   */
  async isSuccessToastDisplayed() {
    try {
      const selector = this.getSelector(this.commonLocators.successToast);
      await this.getLocator(selector).waitFor({ state: 'visible', timeout: 10000 });
      return true;
    } catch {
      return false;
    }
  }

  // ==================== ASSERTION METHODS ====================

  /**
   * Assert Add Candidate page is displayed
   * @param {string} message - Custom assertion message
   */
  async assertAddCandidatePageDisplayed(message = 'Add Candidate page should be displayed') {
    Logger.assertion('Asserting Add Candidate page is displayed');
    const selector = this.getSelector(this.locators.addCandidateHeading);
    await this.getLocator(selector).waitFor({ state: 'visible', timeout: this.timeout });
    const isVisible = await this.getLocator(selector).isVisible();
    assert.equal(isVisible, true, message);
    Logger.info('Assertion passed: Add Candidate page is displayed');
  }

  /**
   * Assert View Candidates page is displayed
   * @param {string} message - Custom assertion message
   */
  async assertViewCandidatesPageDisplayed(message = 'View Candidates page should be displayed') {
    Logger.assertion('Asserting View Candidates page is displayed');
    const selector = this.getSelector(this.viewCandidatesLocators.candidatesHeading);
    await this.getLocator(selector).waitFor({ state: 'visible', timeout: this.timeout });
    const isVisible = await this.getLocator(selector).isVisible();
    assert.equal(isVisible, true, message);
    Logger.info('Assertion passed: View Candidates page is displayed');
  }

  /**
   * Assert First Name input is visible
   * @param {string} message - Custom assertion message
   */
  async assertFirstNameInputVisible(message = 'First Name input should be visible') {
    Logger.assertion('Asserting First Name input is visible');
    const selector = this.getSelector(this.locators.firstNameInput);
    await this.getLocator(selector).waitFor({ state: 'visible', timeout: this.timeout });
    const isVisible = await this.getLocator(selector).isVisible();
    assert.equal(isVisible, true, message);
    Logger.info('Assertion passed: First Name input is visible');
  }

  /**
   * Assert Last Name input is visible
   * @param {string} message - Custom assertion message
   */
  async assertLastNameInputVisible(message = 'Last Name input should be visible') {
    Logger.assertion('Asserting Last Name input is visible');
    const selector = this.getSelector(this.locators.lastNameInput);
    await this.getLocator(selector).waitFor({ state: 'visible', timeout: this.timeout });
    const isVisible = await this.getLocator(selector).isVisible();
    assert.equal(isVisible, true, message);
    Logger.info('Assertion passed: Last Name input is visible');
  }

  /**
   * Assert Email input is visible
   * @param {string} message - Custom assertion message
   */
  async assertEmailInputVisible(message = 'Email input should be visible') {
    Logger.assertion('Asserting Email input is visible');
    const selector = this.getSelector(this.locators.emailInput);
    await this.getLocator(selector).waitFor({ state: 'visible', timeout: this.timeout });
    const isVisible = await this.getLocator(selector).isVisible();
    assert.equal(isVisible, true, message);
    Logger.info('Assertion passed: Email input is visible');
  }

  /**
   * Assert Save button is visible
   * @param {string} message - Custom assertion message
   */
  async assertSaveButtonVisible(message = 'Save button should be visible') {
    Logger.assertion('Asserting Save button is visible');
    const selector = this.getSelector(this.locators.saveButton);
    await this.getLocator(selector).waitFor({ state: 'visible', timeout: this.timeout });
    const isVisible = await this.getLocator(selector).isVisible();
    assert.equal(isVisible, true, message);
    Logger.info('Assertion passed: Save button is visible');
  }

  /**
   * Assert Save button is enabled
   * @param {string} message - Custom assertion message
   */
  async assertSaveButtonEnabled(message = 'Save button should be enabled') {
    Logger.assertion('Asserting Save button is enabled');
    const selector = this.getSelector(this.locators.saveButton);
    await this.getLocator(selector).waitFor({ state: 'visible', timeout: this.timeout });
    const isEnabled = await this.getLocator(selector).isEnabled();
    assert.equal(isEnabled, true, message);
    Logger.info('Assertion passed: Save button is enabled');
  }

  /**
   * Assert candidate added successfully
   * @param {string} message - Custom assertion message
   */
  async assertCandidateAddedSuccessfully(message = 'Candidate should be added successfully') {
    Logger.assertion('Asserting candidate added successfully');
    const selector = this.getSelector(this.commonLocators.successToast);
    await this.getLocator(selector).waitFor({ state: 'visible', timeout: this.timeout });
    const isVisible = await this.getLocator(selector).isVisible();
    assert.equal(isVisible, true, message);
    Logger.info('Assertion passed: Candidate added successfully');
  }

  /**
   * Assert success toast message contains text
   * @param {string} expectedText - Expected text in success toast
   * @param {string} message - Custom assertion message
   */
  async assertSuccessToastContainsText(expectedText, message = 'Success toast should contain text') {
    Logger.assertion(`Asserting success toast contains: ${expectedText}`);
    const selector = this.getSelector(this.commonLocators.successToast);
    await this.getLocator(selector).waitFor({ state: 'visible', timeout: this.timeout });
    const toastText = await this.getLocator(selector).textContent();
    assert.ok(toastText.includes(expectedText), message);
    Logger.info(`Assertion passed: Success toast contains "${expectedText}"`);
  }

  /**
   * Assert URL contains recruitment
   * @param {string} message - Custom assertion message
   */
  async assertUrlContainsRecruitment(message = 'URL should contain recruitment') {
    Logger.assertion('Asserting URL contains recruitment');
    const currentUrl = this.page.url();
    assert.ok(currentUrl.includes('recruitment'), message);
    Logger.info('Assertion passed: URL contains recruitment');
  }

  /**
   * Assert Add button is visible on View Candidates page
   * @param {string} message - Custom assertion message
   */
  async assertAddButtonVisible(message = 'Add button should be visible') {
    Logger.assertion('Asserting Add button is visible');
    const selector = this.getSelector(this.viewCandidatesLocators.addButton);
    await this.getLocator(selector).waitFor({ state: 'visible', timeout: this.timeout });
    const isVisible = await this.getLocator(selector).isVisible();
    assert.equal(isVisible, true, message);
    Logger.info('Assertion passed: Add button is visible');
  }

  /**
   * Assert all Add Candidate form elements are present
   * @param {string} message - Custom assertion message
   */
  async assertAllAddCandidateFormElementsPresent(message = 'All Add Candidate form elements should be present') {
    Logger.assertion('Asserting all Add Candidate form elements are present');
    await this.assertFirstNameInputVisible();
    await this.assertLastNameInputVisible();
    await this.assertEmailInputVisible();
    await this.assertSaveButtonVisible();
    Logger.info('Assertion passed: All Add Candidate form elements are present');
  }

  /**
   * Assert First Name field has specific value
   * @param {string} expectedValue - Expected value
   * @param {string} message - Custom assertion message
   */
  async assertFirstNameValue(expectedValue, message = 'First Name field should have expected value') {
    Logger.assertion(`Asserting First Name field value: ${expectedValue}`);
    const selector = this.getSelector(this.locators.firstNameInput);
    await this.getLocator(selector).waitFor({ state: 'visible', timeout: this.timeout });
    const actualValue = await this.getLocator(selector).inputValue();
    assert.equal(actualValue, expectedValue, message);
    Logger.info(`Assertion passed: First Name field has value "${expectedValue}"`);
  }

  /**
   * Assert Last Name field has specific value
   * @param {string} expectedValue - Expected value
   * @param {string} message - Custom assertion message
   */
  async assertLastNameValue(expectedValue, message = 'Last Name field should have expected value') {
    Logger.assertion(`Asserting Last Name field value: ${expectedValue}`);
    const selector = this.getSelector(this.locators.lastNameInput);
    await this.getLocator(selector).waitFor({ state: 'visible', timeout: this.timeout });
    const actualValue = await this.getLocator(selector).inputValue();
    assert.equal(actualValue, expectedValue, message);
    Logger.info(`Assertion passed: Last Name field has value "${expectedValue}"`);
  }

  /**
   * Assert Email field has specific value
   * @param {string} expectedValue - Expected value
   * @param {string} message - Custom assertion message
   */
  async assertEmailValue(expectedValue, message = 'Email field should have expected value') {
    Logger.assertion(`Asserting Email field value: ${expectedValue}`);
    const selector = this.getSelector(this.locators.emailInput);
    await this.getLocator(selector).waitFor({ state: 'visible', timeout: this.timeout });
    const actualValue = await this.getLocator(selector).inputValue();
    assert.equal(actualValue, expectedValue, message);
    Logger.info(`Assertion passed: Email field has value "${expectedValue}"`);
  }

  /**
   * Assert Contact Number field has specific value
   * @param {string} expectedValue - Expected value
   * @param {string} message - Custom assertion message
   */
  async assertContactNumberValue(expectedValue, message = 'Contact Number field should have expected value') {
    Logger.assertion(`Asserting Contact Number field value: ${expectedValue}`);
    try {
      const contactInput = this.page.locator('.oxd-grid-item').filter({ has: this.page.locator('.oxd-label', { hasText: 'Contact' }) }).locator('.oxd-input');
      await contactInput.waitFor({ state: 'visible', timeout: this.timeout });
      const actualValue = await contactInput.inputValue();
      assert.equal(actualValue, expectedValue, message);
      Logger.info(`Assertion passed: Contact Number field has value "${expectedValue}"`);
    } catch (e) {
      Logger.info(`Primary selector failed: ${e.message}, trying alternative selector`);
      const inputs = this.page.locator('.oxd-grid-item .oxd-input');
      const count = await inputs.count();
      if (count >= 2) {
        const actualValue = await inputs.nth(count - 1).inputValue();
        assert.equal(actualValue, expectedValue, message);
        Logger.info(`Assertion passed: Contact Number field has value "${expectedValue}"`);
      } else {
        throw new Error('Could not find contact number input field');
      }
    }
  }

  /**
   * Get Job Vacancy dropdown selected value
   * @returns {string} Selected job vacancy text
   */
  async getJobVacancyValue() {
    Logger.step('Getting Job Vacancy selected value');
    try {
      const vacancyDropdown = this.page.locator('.oxd-grid-item').filter({ has: this.page.locator('.oxd-label', { hasText: 'Job Vacancy' }) }).locator('.oxd-select-text');
      await vacancyDropdown.waitFor({ state: 'visible', timeout: 10000 });
      const value = await vacancyDropdown.textContent();
      Logger.info(`Job Vacancy value: ${value}`);
      return value.trim();
    } catch (e) {
      Logger.info(`Primary selector failed: ${e.message}, trying alternative selector`);
      const dropdownText = await this.page.locator('.oxd-select-text').first().textContent();
      return dropdownText.trim();
    }
  }

  /**
   * Assert Job Vacancy dropdown has specific value
   * @param {string} expectedValue - Expected value
   * @param {string} message - Custom assertion message
   */
  async assertJobVacancyValue(expectedValue, message = 'Job Vacancy should have expected value') {
    Logger.assertion(`Asserting Job Vacancy value: ${expectedValue}`);
    const actualValue = await this.getJobVacancyValue();
    assert.ok(actualValue.includes(expectedValue), `${message}. Expected: "${expectedValue}", Actual: "${actualValue}"`);
    Logger.info(`Assertion passed: Job Vacancy has value "${expectedValue}"`);
  }

  /**
   * Verify all candidate details on the Add Candidate page
   * @param {object} candidateData - Candidate data object with firstname, lastname, email, contactNumber, jobvacancy
   */
  async verifyCandidateDetailsOnPage(candidateData) {
    Logger.info('Verifying candidate details on Add Candidate page');
    
    if (candidateData.firstname) {
      await this.assertFirstNameValue(candidateData.firstname);
    }
    if (candidateData.lastname) {
      await this.assertLastNameValue(candidateData.lastname);
    }
    if (candidateData.email) {
      await this.assertEmailValue(candidateData.email);
    }
    if (candidateData.contactNumber || candidateData.cnumber) {
      await this.assertContactNumberValue(candidateData.contactNumber || candidateData.cnumber);
    }
    if (candidateData.jobvacancy) {
      await this.assertJobVacancyValue(candidateData.jobvacancy);
    }
    
    Logger.info('All candidate details verified successfully on Add Candidate page');
  }
}

module.exports = AddCandidatePage;
