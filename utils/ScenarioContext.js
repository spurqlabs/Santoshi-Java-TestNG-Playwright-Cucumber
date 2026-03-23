const locatorReader = require('./locatorReader');
const testdataReader = require('./testdataReader');
const Logger = require('./logger');

/**
 * ScenarioContext - Central context manager for test data and locators
 * Provides scenario-specific access to testdata and locators
 */
class ScenarioContext {
  constructor() {
    this.currentScenarioName = null;
    this.currentTestData = null;
    this.contextData = {};
  }

  /**
   * Initialize context for a scenario
   * @param {string} scenarioName - Name of the current scenario
   */
  initializeScenario(scenarioName) {
    Logger.info(`Initializing ScenarioContext for: ${scenarioName}`);
    this.currentScenarioName = scenarioName;
    this.currentTestData = null;
    this.contextData = {};
    
    // Try to load test data for the scenario
    try {
      this.currentTestData = testdataReader.getTestDataByScenarioName(scenarioName);
      Logger.info(`Test data loaded for scenario: ${scenarioName}`);
    } catch (error) {
      Logger.warn(`No test data found for scenario: ${scenarioName}`);
    }
  }

  /**
   * Get current scenario name
   * @returns {string} - Current scenario name
   */
  getCurrentScenarioName() {
    return this.currentScenarioName;
  }

  // ==================== UNIFIED TEST DATA METHOD ====================

  /**
   * Get test data field value by field name (UNIFIED METHOD)
   * This is the single method to access all test data fields
   * @param {string} fieldName - Field name to retrieve (e.g., 'username', 'firstname', 'email')
   * @returns {any} - Field value
   */
  getData(fieldName) {
    // First, try to get from current scenario test data
    if (this.currentTestData && fieldName in this.currentTestData) {
      return this.currentTestData[fieldName];
    }

    // Handle special cases with fallback logic
    switch (fieldName) {
      case 'username':
        return this._getCredentialWithFallback('username');
      case 'password':
        return this._getCredentialWithFallback('password');
      default:
        // If not found in current test data, throw error
        if (!this.currentTestData) {
          throw new Error(`No test data available for scenario: ${this.currentScenarioName}`);
        }
        throw new Error(`Field '${fieldName}' not found in test data for scenario: ${this.currentScenarioName}`);
    }
  }

  /**
   * Get credential field with fallback to any available credentials
   * @param {string} field - 'username' or 'password'
   * @returns {string} - Credential value
   * @private
   */
  _getCredentialWithFallback(field) {
    if (this.currentTestData && this.currentTestData[field]) {
      return this.currentTestData[field];
    }
    // Fallback to credentials from any scenario
    Logger.info(`${field} not found in current scenario, falling back to available credentials`);
    const credentials = testdataReader.getCredentials();
    return credentials[field];
  }

  /**
   * Get all test data for current scenario
   * @returns {object} - Test data object
   */
  getAllTestData() {
    if (!this.currentTestData) {
      throw new Error(`No test data available for scenario: ${this.currentScenarioName}`);
    }
    return this.currentTestData;
  }

  /**
   * Check if a field exists in current test data
   * @param {string} fieldName - Field name to check
   * @returns {boolean} - True if field exists
   */
  hasData(fieldName) {
    return this.currentTestData && fieldName in this.currentTestData;
  }

  /**
   * Get test data by scenario name (explicit)
   * @param {string} scenarioName - Scenario name
   * @returns {object} - Test data
   */
  getTestDataByScenario(scenarioName) {
    return testdataReader.getTestDataByScenarioName(scenarioName);
  }

  // ==================== LOCATOR METHODS ====================

  /**
   * Get locator by page and element name
   * @param {string} pageName - Page name (e.g., 'loginPage')
   * @param {string} elementName - Element name (e.g., 'usernameInput')
   * @returns {string} - Locator string
   */
  getLocator(pageName, elementName) {
    return locatorReader.getLocator(pageName, elementName);
  }

  /**
   * Get all locators for a page
   * @param {string} pageName - Page name
   * @returns {object} - All locators for the page
   */
  getPageLocators(pageName) {
    return locatorReader.getPageLocators(pageName);
  }

  /**
   * Get all locators
   * @returns {object} - All locators
   */
  getAllLocators() {
    return locatorReader.getAllLocators();
  }

  // Page-specific locator methods
  getLoginPageLocators() {
    return locatorReader.getLoginPageLocators();
  }

  getDashboardPageLocators() {
    return locatorReader.getDashboardPageLocators();
  }

  getSideMenuLocators() {
    return locatorReader.getSideMenuLocators();
  }

  getTimeModuleLocators() {
    return locatorReader.getTimeModuleLocators();
  }

  getTimesheetsLocators() {
    return locatorReader.getTimesheetsLocators();
  }

  getMyTimesheetLocators() {
    return locatorReader.getMyTimesheetLocators();
  }

  getEditTimesheetLocators() {
    return locatorReader.getEditTimesheetLocators();
  }

  getReportsLocators() {
    return locatorReader.getReportsLocators();
  }

  getCommonLocators() {
    return locatorReader.getCommonLocators();
  }

  // ==================== RECRUITMENT LOCATOR METHODS ====================

  /**
   * Get recruitment menu locator
   * @returns {object} - Recruitment menu locator
   */
  getRecruitmentMenuLocator() {
    return locatorReader.getRecruitmentMenuLocator();
  }

  /**
   * Get view candidates page locators
   * @returns {object} - View candidates page locators
   */
  getViewCandidatesPageLocators() {
    return locatorReader.getViewCandidatesPageLocators();
  }

  /**
   * Get add candidate page locators
   * @returns {object} - Add candidate page locators
   */
  getAddCandidatePageLocators() {
    return locatorReader.getAddCandidatePageLocators();
  }

  /**
   * Get application stage page locators
   * @returns {object} - Application stage page locators
   */
  getApplicationStagePageLocators() {
    return locatorReader.getApplicationStagePageLocators();
  }

  /**
   * Get shortlist candidate page locators
   * @returns {object} - Shortlist candidate page locators
   */
  getShortlistCandidatePageLocators() {
    return locatorReader.getShortlistCandidatePageLocators();
  }

  /**
   * Get schedule interview page locators
   * @returns {object} - Schedule interview page locators
   */
  getScheduleInterviewPageLocators() {
    return locatorReader.getScheduleInterviewPageLocators();
  }

  /**
   * Get profile menu locators
   * @returns {object} - Profile menu locators
   */
  getProfileMenuLocators() {
    return locatorReader.getProfileMenuLocators();
  }

  /**
   * Get common locators for recruitment
   * @returns {object} - Common locators
   */
  getCommonLocatorsRecruitment() {
    return locatorReader.getCommonLocatorsRecruitment();
  }

  // ==================== CONTEXT DATA METHODS ====================

  /**
   * Set custom data in context
   * @param {string} key - Key name
   * @param {any} value - Value to store
   */
  setContextData(key, value) {
    this.contextData[key] = value;
    Logger.info(`Context data set: ${key}`);
  }

  /**
   * Get custom data from context
   * @param {string} key - Key name
   * @returns {any} - Stored value
   */
  getContextData(key) {
    if (!(key in this.contextData)) {
      throw new Error(`Context data key '${key}' not found`);
    }
    return this.contextData[key];
  }

  /**
   * Check if context data exists
   * @param {string} key - Key name
   * @returns {boolean} - True if exists
   */
  hasContextData(key) {
    return key in this.contextData;
  }

  /**
   * Remove context data
   * @param {string} key - Key name
   */
  removeContextData(key) {
    delete this.contextData[key];
    Logger.info(`Context data removed: ${key}`);
  }

  /**
   * Clear all context data
   */
  clearContextData() {
    this.contextData = {};
    Logger.info('All context data cleared');
  }

  /**
   * Get all context data
   * @returns {object} - All context data
   */
  getAllContextData() {
    return { ...this.contextData };
  }

  // ==================== UTILITY METHODS ====================

  /**
   * Reset the entire scenario context
   */
  reset() {
    this.currentScenarioName = null;
    this.currentTestData = null;
    this.contextData = {};
    Logger.info('ScenarioContext reset');
  }

  /**
   * Get scenario context summary
   * @returns {object} - Context summary
   */
  getSummary() {
    return {
      scenarioName: this.currentScenarioName,
      hasTestData: this.currentTestData !== null,
      testDataKeys: this.currentTestData ? Object.keys(this.currentTestData) : [],
      contextDataKeys: Object.keys(this.contextData)
    };
  }
}

// Export class (not singleton) - each scenario should have its own instance
module.exports = ScenarioContext;
