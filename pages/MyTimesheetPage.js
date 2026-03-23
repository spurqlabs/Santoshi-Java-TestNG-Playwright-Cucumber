const BasePage = require('./BasePage');
const locatorReader = require('../utils/locatorReader');
const configManager = require('../utils/configManager');
const Logger = require('../utils/logger');
const assert = require('assert');

/**
 * My Timesheet Page Object Model
 * Handles timesheet related operations
 */
class MyTimesheetPage extends BasePage {
  constructor(page, scenarioContext = null) {
    super(page);
    
    // Load locators from locatorReader
    this.timeModuleLocators = locatorReader.getTimeModuleLocators();
    this.timesheetsLocators = locatorReader.getTimesheetsLocators();
    this.myTimesheetLocators = locatorReader.getMyTimesheetLocators();
    this.editTimesheetLocators = locatorReader.getEditTimesheetLocators();
    this.sideMenuLocators = locatorReader.getSideMenuLocators();
    this.commonLocators = locatorReader.getCommonLocators();
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
   * Navigate to Time module from side menu
   */
  async navigateToTimeModule() {
    Logger.step('Navigating to Time module from side menu');
    await this.click(this.sideMenuLocators.timeLink);
    await this.page.waitForLoadState('networkidle');
    Logger.info('Successfully navigated to Time module');
  }

  /**
   * Click on Timesheets menu item
   */
  async clickTimesheetsMenu() {
    Logger.step('Clicking on Timesheets menu item');
    await this.click(this.timeModuleLocators.timesheetsMenu);
    await this.page.waitForTimeout(500);
    Logger.info('Timesheets menu item clicked');
  }

  /**
   * Check if ViewEmployeeTimesheet page is displayed
   */
  async isViewEmployeeTimesheetPageDisplayed() {
    try {
      await this.page.waitForSelector(this.timesheetsLocators.selectEmployeeHeading, { state: 'visible', timeout: 10000 });
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Check if Timesheet dropdown is displayed
   */
  async isTimesheetDropdownDisplayed() {
    try {
      await this.page.waitForSelector(this.timesheetsLocators.myTimesheetsMenuItem, { state: 'visible', timeout: 5000 });
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Select My Timesheets from dropdown
   */
  async selectMyTimesheets() {
    Logger.step('Selecting My Timesheets from dropdown');
    await this.click(this.timesheetsLocators.myTimesheetsMenuItem);
    await this.page.waitForLoadState('networkidle');
    Logger.info('My Timesheets selected successfully');
  }

  /**
   * Check if ViewMyTimesheet page is displayed
   */
  async isViewMyTimesheetPageDisplayed() {
    try {
      await this.page.waitForSelector(this.myTimesheetLocators.myTimesheetHeading, { state: 'visible', timeout: 10000 });
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Click Edit button
   */
  async clickEditButton() {
    Logger.step('Clicking Edit button on timesheet');
    await this.click(this.myTimesheetLocators.editButton);
    await this.page.waitForLoadState('networkidle');
    // Additional wait for the form to be ready
    await this.page.waitForTimeout(2000);
    Logger.info('Edit button clicked, timesheet form loading');
  }

  /**
   * Check if Edit Timesheet page is displayed
   */
  async isEditTimesheetPageDisplayed() {
    try {
      await this.page.waitForSelector(this.editTimesheetLocators.editTimesheetHeading, { state: 'visible', timeout: 10000 });
      // Wait for the table/form to be ready
      await this.page.waitForTimeout(1000);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Wait for the timesheet form to be ready
   */
  async waitForTimesheetFormReady() {
    try {
      // Wait for the table to be present
      await this.page.waitForSelector('.oxd-table', { state: 'visible', timeout: 10000 });
      // Wait for input fields to be available
      await this.page.waitForSelector('input[placeholder="Type for hints..."]', { state: 'visible', timeout: 10000 });
      Logger.info('Timesheet form is ready');
      return true;
    } catch (error) {
      Logger.error('Timesheet form not ready: ' + error.message);
      return false;
    }
  }

  /**
   * Enter project name
   * @param {string} projectName - Project name to enter (required)
   */
  async enterProjectName(projectName) {
    if (!projectName) {
      throw new Error('Project name is required for enterProjectName method');
    }
    
    // Wait for form to be ready
    await this.waitForTimesheetFormReady();
    
    // Find the project input field
    const projectInput = await this.page.$('input[placeholder="Type for hints..."]');
    if (!projectInput) {
      throw new Error('Project input field not found');
    }
    
    // Click on the project input to focus it
    await projectInput.click();
    await this.page.waitForTimeout(500);
    
    // Clear and fill the project name
    await projectInput.fill('');
    await this.page.waitForTimeout(300);
    await projectInput.type(projectName, { delay: 100 });
    await this.page.waitForTimeout(1500);
  }

  /**
   * Select project from autocomplete dropdown
   * @param {string} projectName - Project name to select (optional, uses scenarioContext if not provided)
   */
  async selectProject(projectName) {
    // If projectName not provided, get from scenarioContext
    if (!projectName && this.scenarioContext) {
      projectName = this.scenarioContext.getData('projectName');
    }
    if (!projectName) {
      throw new Error('Project name is required for selectProject method');
    }
    
    Logger.step(`Selecting project: ${projectName}`);
    
    // Wait for form to be ready
    await this.waitForTimesheetFormReady();
    
    // Find the project input field
    const projectInput = await this.page.$('input[placeholder="Type for hints..."]');
    if (!projectInput) {
      throw new Error('Project input field not found');
    }
    
    // Click on the project input to focus it
    await projectInput.click();
    await this.page.waitForTimeout(500);
    
    // Clear and type the project name with delay to trigger autocomplete
    await projectInput.fill('');
    await this.page.waitForTimeout(300);
    await projectInput.type(projectName, { delay: 100 });
    
    // Wait for autocomplete dropdown to appear
    await this.page.waitForTimeout(2000);
    
    // Wait for autocomplete options to be visible
    try {
      await this.page.waitForSelector('.oxd-autocomplete-option', { state: 'visible', timeout: 10000 });
      
      // Click on the first matching option
      const options = await this.page.$$('.oxd-autocomplete-option');
      if (options.length > 0) {
        await options[0].click();
        await this.page.waitForTimeout(1000);
        Logger.info(`Project "${projectName}" selected successfully`);
      } else {
        throw new Error('No project options found in autocomplete dropdown');
      }
    } catch (error) {
      Logger.warn('Project autocomplete options not found, trying alternative approach');
      // Try pressing Enter to select the first option
      await this.page.keyboard.press('Enter');
      await this.page.waitForTimeout(1000);
    }
  }

  /**
   * Select activity from dropdown
   * @param {string} activity - Activity to select (optional, uses scenarioContext if not provided)
   */
  async selectActivity(activity) {
    // If activity not provided, get from scenarioContext
    if (!activity && this.scenarioContext) {
      activity = this.scenarioContext.getData('activity');
    }
    if (!activity) {
      throw new Error('Activity is required for selectActivity method');
    }
    
    Logger.step(`Selecting activity: ${activity}`);
    
    // Wait for activity dropdown to be ready
    await this.page.waitForTimeout(500);
    
    // Find the activity dropdown (second .oxd-select-text in the row)
    const activityDropdowns = await this.page.$$('.oxd-select-text');
    if (activityDropdowns.length === 0) {
      throw new Error('Activity dropdown not found');
    }
    
    // Click on the activity dropdown to open it (use the first one in the timesheet row)
    await activityDropdowns[0].click();
    await this.page.waitForTimeout(1000);
    
    // Wait for dropdown options to appear
    try {
      await this.page.waitForSelector('.oxd-select-option', { state: 'visible', timeout: 10000 });
      
      // Click on the matching activity option
      const activityOptionSelector = `.oxd-select-option:has-text("${activity}")`;
      await this.page.waitForSelector(activityOptionSelector, { state: 'visible', timeout: 5000 });
      await this.page.click(activityOptionSelector);
      await this.page.waitForTimeout(1000);
      Logger.info(`Activity "${activity}" selected successfully`);
    } catch (error) {
      Logger.warn('Activity option not found, trying alternative approach');
      // Try to find and click any available option
      const options = await this.page.$$('.oxd-select-option');
      if (options.length > 0) {
        await options[0].click();
        await this.page.waitForTimeout(1000);
      } else {
        throw new Error('No activity options found in dropdown');
      }
    }
  }

  /**
   * Enter hours for each day (time duration) - OPTIMIZED VERSION
   * @param {object} hours - Object containing hours for each day (optional, uses scenarioContext if not provided)
   *                          Expected format: { monday, tuesday, wednesday, thursday, friday, saturday, sunday }
   */
  async enterTimeDuration(hours) {
    // If hours not provided, get from scenarioContext
    if (!hours && this.scenarioContext) {
      hours = {
        monday: this.scenarioContext.getData('mondayHours') || '0',
        tuesday: this.scenarioContext.getData('tuesdayHours') || '0',
        wednesday: this.scenarioContext.getData('wednesdayHours') || '0',
        thursday: this.scenarioContext.getData('thursdayHours') || '0',
        friday: this.scenarioContext.getData('fridayHours') || '0',
        saturday: this.scenarioContext.getData('saturdayHours') || '0',
        sunday: this.scenarioContext.getData('sundayHours') || '0'
      };
    }
    if (!hours) {
      throw new Error('Hours object is required for enterTimeDuration method. Expected format: { monday, tuesday, wednesday, thursday, friday, saturday, sunday }');
    }
    
    Logger.step('Starting to enter time duration');
    
    // Wait for the page to be fully loaded
    await this.page.waitForLoadState('networkidle');
    
    // Find all hours input fields directly using a simpler approach
    const allInputs = await this.page.$$('input.oxd-input');
    const hoursInputs = [];
    
    for (const input of allInputs) {
      const placeholder = await input.getAttribute('placeholder');
      // Skip search and project autocomplete inputs
      if (placeholder !== 'Search' && placeholder !== 'Type for hints...') {
        hoursInputs.push(input);
      }
    }
    
    Logger.info(`Found ${hoursInputs.length} hours input fields`);
    
    const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
    
    if (hoursInputs.length === 0) {
      throw new Error('No hours input fields found on the page');
    }
    
    for (let i = 0; i < Math.min(hoursInputs.length, 7); i++) {
      const day = days[i];
      const hoursValue = hours[day];
      
      if (hoursValue) {
        Logger.step(`Entering ${hoursValue} hours for ${day}`);
        
        try {
          // Scroll into view, triple-click to select all, and fill with new value
          await hoursInputs[i].scrollIntoViewIfNeeded();
          await hoursInputs[i].click({ clickCount: 3 });
          await hoursInputs[i].fill(hoursValue);
          
          // Press Tab to move to next field (triggers validation)
          await this.page.keyboard.press('Tab');
          
          Logger.info(`Successfully entered ${hoursValue} for ${day}`);
        } catch (error) {
          Logger.error(`Error entering hours for ${day}: ${error.message}`);
        }
      }
    }
    
    Logger.info('Time duration entry completed');
  }

  /**
   * Click Save button
   */
  async clickSaveButton() {
    Logger.step('Clicking Save button');
    await this.click(this.editTimesheetLocators.saveButton);
    await this.page.waitForTimeout(5000);
    Logger.info('Save button clicked');
  }

  
  /**
   * Get status text from My Timesheet page
   */
  async getStatusText() {
    return await this.getText(this.myTimesheetLocators.statusText);
  }

  /**
   * Check if No Timesheets alert is displayed
   */
  async isNoTimesheetsAlertDisplayed() {
    return await this.isVisible(this.myTimesheetLocators.noTimesheetsAlert);
  }

 

  

  /**
   * Verify timesheet is saved successfully
   */
  async isTimesheetSavedSuccessfully() {
    try {
      await this.page.waitForSelector(this.commonLocators.toastSuccess, { state: 'visible', timeout: 5000 });
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Get success toast message
   */
  async getSuccessMessage() {
    try {
      return await this.getText(this.commonLocators.toastMessage);
    } catch {
      return null;
    }
  }

  // ==================== ASSERTION METHODS ====================

  /**
   * Assert Time module is displayed
   * @param {string} message - Custom assertion message
   */
  async assertTimeModuleDisplayed(message = 'Time module should be displayed') {
    Logger.assertion('Asserting Time module is displayed');
    const locator = this.page.locator(this.sideMenuLocators.timeLink);
    await locator.waitFor({ state: 'visible', timeout: this.timeout });
    const isVisible = await locator.isVisible();
    assert.equal(isVisible, true, message);
    Logger.info('Assertion passed: Time module is displayed');
  }

  /**
   * Assert Timesheets menu is visible
   * @param {string} message - Custom assertion message
   */
  async assertTimesheetsMenuVisible(message = 'Timesheets menu should be visible') {
    Logger.assertion('Asserting Timesheets menu is visible');
    const locator = this.page.locator(this.timeModuleLocators.timesheetsMenu);
    await locator.waitFor({ state: 'visible', timeout: this.timeout });
    const isVisible = await locator.isVisible();
    assert.equal(isVisible, true, message);
    Logger.info('Assertion passed: Timesheets menu is visible');
  }

  /**
   * Assert My Timesheets menu item is visible
   * @param {string} message - Custom assertion message
   */
  async assertMyTimesheetsMenuItemVisible(message = 'My Timesheets menu item should be visible') {
    Logger.assertion('Asserting My Timesheets menu item is visible');
    const locator = this.page.locator(this.timesheetsLocators.myTimesheetsMenuItem);
    await locator.waitFor({ state: 'visible', timeout: this.timeout });
    const isVisible = await locator.isVisible();
    assert.equal(isVisible, true, message);
    Logger.info('Assertion passed: My Timesheets menu item is visible');
  }

  /**
   * Assert View My Timesheet page is displayed
   * @param {string} message - Custom assertion message
   */
  async assertViewMyTimesheetPageDisplayed(message = 'View My Timesheet page should be displayed') {
    Logger.assertion('Asserting View My Timesheet page is displayed');
    const locator = this.page.locator(this.myTimesheetLocators.myTimesheetHeading);
    await locator.waitFor({ state: 'visible', timeout: this.timeout });
    const isVisible = await locator.isVisible();
    assert.equal(isVisible, true, message);
    Logger.info('Assertion passed: View My Timesheet page is displayed');
  }

  /**
   * Assert Edit Timesheet page is displayed
   * @param {string} message - Custom assertion message
   */
  async assertEditTimesheetPageDisplayed(message = 'Edit Timesheet page should be displayed') {
    Logger.assertion('Asserting Edit Timesheet page is displayed');
    const locator = this.page.locator(this.editTimesheetLocators.editTimesheetHeading);
    await locator.waitFor({ state: 'visible', timeout: this.timeout });
    const isVisible = await locator.isVisible();
    assert.equal(isVisible, true, message);
    Logger.info('Assertion passed: Edit Timesheet page is displayed');
  }

  /**
   * Assert Edit button is visible
   * @param {string} message - Custom assertion message
   */
  async assertEditButtonVisible(message = 'Edit button should be visible') {
    Logger.assertion('Asserting Edit button is visible');
    const locator = this.page.locator(this.myTimesheetLocators.editButton);
    await locator.waitFor({ state: 'visible', timeout: this.timeout });
    const isVisible = await locator.isVisible();
    assert.equal(isVisible, true, message);
    Logger.info('Assertion passed: Edit button is visible');
  }

  /**
   * Assert Edit button is enabled
   * @param {string} message - Custom assertion message
   */
  async assertEditButtonEnabled(message = 'Edit button should be enabled') {
    Logger.assertion('Asserting Edit button is enabled');
    const locator = this.page.locator(this.myTimesheetLocators.editButton);
    await locator.waitFor({ state: 'visible', timeout: this.timeout });
    const isEnabled = await locator.isEnabled();
    assert.equal(isEnabled, true, message);
    Logger.info('Assertion passed: Edit button is enabled');
  }

  /**
   * Assert Save button is visible
   * @param {string} message - Custom assertion message
   */
  async assertSaveButtonVisible(message = 'Save button should be visible') {
    Logger.assertion('Asserting Save button is visible');
    const locator = this.page.locator(this.editTimesheetLocators.saveButton);
    await locator.waitFor({ state: 'visible', timeout: this.timeout });
    const isVisible = await locator.isVisible();
    assert.equal(isVisible, true, message);
    Logger.info('Assertion passed: Save button is visible');
  }

  /**
   * Assert Save button is enabled
   * @param {string} message - Custom assertion message
   */
  async assertSaveButtonEnabled(message = 'Save button should be enabled') {
    Logger.assertion('Asserting Save button is enabled');
    const locator = this.page.locator(this.editTimesheetLocators.saveButton);
    await locator.waitFor({ state: 'visible', timeout: this.timeout });
    const isEnabled = await locator.isEnabled();
    assert.equal(isEnabled, true, message);
    Logger.info('Assertion passed: Save button is enabled');
  }

  /**
   * Assert timesheet status
   * @param {string} expectedStatus - Expected status text
   * @param {string} message - Custom assertion message
   */
  async assertTimesheetStatus(expectedStatus, message = 'Timesheet status should match') {
    Logger.assertion(`Asserting timesheet status: ${expectedStatus}`);
    const locator = this.page.locator(this.myTimesheetLocators.statusText);
    await locator.waitFor({ state: 'visible', timeout: this.timeout });
    const actualText = await locator.textContent();
    assert.ok(actualText.includes(expectedStatus), message);
    Logger.info(`Assertion passed: Timesheet status contains "${expectedStatus}"`);
  }

  /**
   * Assert success toast is displayed
   * @param {string} message - Custom assertion message
   */
  async assertSuccessToastDisplayed(message = 'Success toast should be displayed') {
    Logger.assertion('Asserting success toast is displayed');
    const locator = this.page.locator(this.commonLocators.toastSuccess);
    await locator.waitFor({ state: 'visible', timeout: this.timeout });
    const isVisible = await locator.isVisible();
    assert.equal(isVisible, true, message);
    Logger.info('Assertion passed: Success toast is displayed');
  }

  /**
   * Assert success message text
   * @param {string} expectedMessage - Expected success message
   * @param {string} message - Custom assertion message
   */
  async assertSuccessMessageText(expectedMessage, message = 'Success message should match') {
    Logger.assertion(`Asserting success message: ${expectedMessage}`);
    const locator = this.page.locator(this.commonLocators.toastMessage);
    await locator.waitFor({ state: 'visible', timeout: this.timeout });
    const actualText = await locator.textContent();
    assert.ok(actualText.includes(expectedMessage), message);
    Logger.info(`Assertion passed: Success message contains "${expectedMessage}"`);
  }

  /**
   * Assert timesheet saved successfully
   * @param {string} message - Custom assertion message
   */
  async assertTimesheetSavedSuccessfully(message = 'Timesheet should be saved successfully') {
    Logger.assertion('Asserting timesheet saved successfully');
    await this.assertSuccessToastDisplayed();
    Logger.info('Assertion passed: Timesheet saved successfully');
  }

  /**
   * Assert No Timesheets alert is displayed
   * @param {string} message - Custom assertion message
   */
  async assertNoTimesheetsAlertDisplayed(message = 'No Timesheets alert should be displayed') {
    Logger.assertion('Asserting No Timesheets alert is displayed');
    const locator = this.page.locator(this.myTimesheetLocators.noTimesheetsAlert);
    await locator.waitFor({ state: 'visible', timeout: this.timeout });
    const isVisible = await locator.isVisible();
    assert.equal(isVisible, true, message);
    Logger.info('Assertion passed: No Timesheets alert is displayed');
  }

  /**
   * Assert timesheet form is ready
   * @param {string} message - Custom assertion message
   */
  async assertTimesheetFormReady(message = 'Timesheet form should be ready') {
    Logger.assertion('Asserting timesheet form is ready');
    const isReady = await this.waitForTimesheetFormReady();
    assert.equal(isReady, true, message);
    Logger.info('Assertion passed: Timesheet form is ready');
  }

  /**
   * Assert project input field is visible
   * @param {string} message - Custom assertion message
   */
  async assertProjectInputVisible(message = 'Project input field should be visible') {
    Logger.assertion('Asserting project input field is visible');
    const locator = this.page.locator('input[placeholder="Type for hints..."]');
    await locator.waitFor({ state: 'visible', timeout: this.timeout });
    const isVisible = await locator.isVisible();
    assert.equal(isVisible, true, message);
    Logger.info('Assertion passed: Project input field is visible');
  }

  /**
   * Assert activity dropdown is visible
   * @param {string} message - Custom assertion message
   */
  async assertActivityDropdownVisible(message = 'Activity dropdown should be visible') {
    Logger.assertion('Asserting activity dropdown is visible');
    const activityDropdowns = await this.page.$$('.oxd-select-text');
    assert.ok(activityDropdowns.length > 0, message);
    Logger.info('Assertion passed: Activity dropdown is visible');
  }

  /**
   * Assert hours input fields are present
   * @param {number} expectedCount - Expected number of hours input fields (default: 7 for each day)
   * @param {string} message - Custom assertion message
   */
  async assertHoursInputFieldsPresent(expectedCount = 7, message = 'Hours input fields should be present') {
    Logger.assertion(`Asserting ${expectedCount} hours input fields are present`);
    const allInputs = await this.page.$$('input');
    let hoursInputsCount = 0;
    
    for (const input of allInputs) {
      const placeholder = await input.getAttribute('placeholder');
      const className = await input.getAttribute('class');
      
      if (className && className.includes('oxd-input') && (!placeholder || placeholder === 'null' || placeholder === 'Search')) {
        if (placeholder !== 'Search' && placeholder !== 'Type for hints...') {
          hoursInputsCount++;
        }
      }
    }
    
    assert.ok(hoursInputsCount >= expectedCount, message);
    Logger.info(`Assertion passed: ${hoursInputsCount} hours input fields found`);
  }

  /**
   * Assert URL contains specific path
   * @param {string} path - Expected URL path
   * @param {string} message - Custom assertion message
   */
  async assertUrlContains(path, message = 'URL should contain expected path') {
    Logger.assertion(`Asserting URL contains: ${path}`);
    const currentUrl = this.page.url();
    assert.ok(currentUrl.includes(path), message);
    Logger.info(`Assertion passed: URL contains "${path}"`);
  }

  /**
   * Assert Time module page is loaded
   * @param {string} message - Custom assertion message
   */
  async assertTimeModulePageLoaded(message = 'Time module page should be loaded') {
    Logger.assertion('Asserting Time module page is loaded');
    const currentUrl = this.page.url();
    assert.ok(currentUrl.includes('time'), message);
    Logger.info('Assertion passed: Time module page is loaded');
  }

  /**
   * Assert View Employee Timesheet page is displayed
   * @param {string} message - Custom assertion message
   */
  async assertViewEmployeeTimesheetPageDisplayed(message = 'View Employee Timesheet page should be displayed') {
    Logger.assertion('Asserting View Employee Timesheet page is displayed');
    const locator = this.page.locator(this.timesheetsLocators.selectEmployeeHeading);
    await locator.waitFor({ state: 'visible', timeout: this.timeout });
    const isVisible = await locator.isVisible();
    assert.equal(isVisible, true, message);
    Logger.info('Assertion passed: View Employee Timesheet page is displayed');
  }

  /**
   * Assert timesheet heading text
   * @param {string} expectedHeading - Expected heading text
   * @param {string} message - Custom assertion message
   */
  async assertTimesheetHeadingText(expectedHeading, message = 'Timesheet heading should match') {
    Logger.assertion(`Asserting timesheet heading: ${expectedHeading}`);
    const locator = this.page.locator(this.myTimesheetLocators.myTimesheetHeading);
    await locator.waitFor({ state: 'visible', timeout: this.timeout });
    const actualText = await locator.textContent();
    assert.equal(actualText.trim(), expectedHeading, message);
    Logger.info(`Assertion passed: Timesheet heading matches "${expectedHeading}"`);
  }

  /**
   * Assert edit timesheet heading text
   * @param {string} expectedHeading - Expected heading text
   * @param {string} message - Custom assertion message
   */
  async assertEditTimesheetHeadingText(expectedHeading, message = 'Edit timesheet heading should match') {
    Logger.assertion(`Asserting edit timesheet heading: ${expectedHeading}`);
    const locator = this.page.locator(this.editTimesheetLocators.editTimesheetHeading);
    await locator.waitFor({ state: 'visible', timeout: this.timeout });
    const actualText = await locator.textContent();
    assert.equal(actualText.trim(), expectedHeading, message);
    Logger.info(`Assertion passed: Edit timesheet heading matches "${expectedHeading}"`);
  }

  /**
   * Assert error toast is displayed
   * @param {string} message - Custom assertion message
   */
  async assertErrorToastDisplayed(message = 'Error toast should be displayed') {
    Logger.assertion('Asserting error toast is displayed');
    const locator = this.page.locator(this.commonLocators.toastError);
    await locator.waitFor({ state: 'visible', timeout: this.timeout });
    const isVisible = await locator.isVisible();
    assert.equal(isVisible, true, message);
    Logger.info('Assertion passed: Error toast is displayed');
  }

  /**
   * Assert page title contains text
   * @param {string} expectedTitle - Expected title text
   * @param {string} message - Custom assertion message
   */
  async assertPageTitleContains(expectedTitle, message = 'Page title should contain expected text') {
    Logger.assertion(`Asserting page title contains: ${expectedTitle}`);
    const actualTitle = await this.page.title();
    assert.ok(actualTitle.includes(expectedTitle), message);
    Logger.info(`Assertion passed: Page title contains "${expectedTitle}"`);
  }

  /**
   * Assert element is visible on timesheet page
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
   * Assert element contains text
   * @param {string} selector - Element selector
   * @param {string} expectedText - Expected text
   * @param {string} message - Custom assertion message
   */
  async assertElementContainsText(selector, expectedText, message = 'Element should contain expected text') {
    Logger.assertion(`Asserting element contains text: ${expectedText}`);
    const locator = this.page.locator(selector);
    await locator.waitFor({ state: 'visible', timeout: this.timeout });
    const actualText = await locator.textContent();
    assert.ok(actualText.includes(expectedText), message);
    Logger.info(`Assertion passed: Element contains "${expectedText}"`);
  }
}

module.exports = MyTimesheetPage;
