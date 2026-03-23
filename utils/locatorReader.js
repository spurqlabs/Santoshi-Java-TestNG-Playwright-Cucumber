const fs = require('fs');
const path = require('path');

/**
 * Locator Reader - Reads and manages locators from multiple JSON files
 * Supports both simple format (locators.json) and structured format (recruit_locators.json)
 */
class LocatorReader {
  constructor() {
    this.locators = {};
    this.locatorFiles = ['locators.json', 'recruit_locators.json'];
    this.loadAllLocators();
  }

  /**
   * Load all locator files from the locators directory
   */
  loadAllLocators() {
    const locatorsDir = path.join(__dirname, '../locators');
    
    // Load predefined locator files
    for (const file of this.locatorFiles) {
      this.loadLocatorFile(path.join(locatorsDir, file));
    }

    // Also scan for any additional JSON files in the locators directory
    try {
      const files = fs.readdirSync(locatorsDir);
      for (const file of files) {
        if (file.endsWith('.json') && !this.locatorFiles.includes(file)) {
          this.loadLocatorFile(path.join(locatorsDir, file));
        }
      }
    } catch (error) {
      console.error(`Error scanning locators directory: ${error.message}`);
    }
  }

  /**
   * Load a single locator file
   * @param {string} filePath - Full path to the locator file
   */
  loadLocatorFile(filePath) {
    try {
      if (fs.existsSync(filePath)) {
        const rawData = fs.readFileSync(filePath, 'utf8');
        const data = JSON.parse(rawData);
        // Merge locators from this file
        this.locators = { ...this.locators, ...data };
        console.log(`Loaded locators from: ${path.basename(filePath)}`);
      }
    } catch (error) {
      console.error(`Failed to load locator file ${filePath}: ${error.message}`);
    }
  }

  /**
   * Get locator by page and element name
   * @param {string} pageName - Page name (e.g., 'loginPage', 'viewCandidatesPage')
   * @param {string} elementName - Element name (e.g., 'usernameInput', 'addButton')
   * @returns {string|object} - Locator string or locator object with selector, description, locatorType
   */
  getLocator(pageName, elementName) {
    try {
      const pageLocators = this.locators[pageName];
      if (!pageLocators) {
        throw new Error(`Page not found: ${pageName}`);
      }
      const locator = pageLocators[elementName];
      if (!locator) {
        throw new Error(`Element not found: ${pageName}.${elementName}`);
      }
      return locator;
    } catch (error) {
      console.error(`Locator not found: ${pageName}.${elementName}`);
      throw new Error(`Locator not found: ${pageName}.${elementName}`);
    }
  }

  /**
   * Get selector string from locator (handles both simple and structured formats)
   * @param {string} pageName - Page name
   * @param {string} elementName - Element name
   * @returns {string} - Selector string
   */
  getSelector(pageName, elementName) {
    const locator = this.getLocator(pageName, elementName);
    // Handle structured format (recruit_locators.json style)
    if (typeof locator === 'object' && locator.selector) {
      return locator.selector;
    }
    // Handle simple format (locators.json style)
    return locator;
  }

  /**
   * Get locator type (for structured format)
   * @param {string} pageName - Page name
   * @param {string} elementName - Element name
   * @returns {string|null} - Locator type (e.g., 'css', 'role') or null for simple format
   */
  getLocatorType(pageName, elementName) {
    const locator = this.getLocator(pageName, elementName);
    if (typeof locator === 'object' && locator.locatorType) {
      return locator.locatorType;
    }
    return null;
  }

  /**
   * Get locator description (for structured format)
   * @param {string} pageName - Page name
   * @param {string} elementName - Element name
   * @returns {string|null} - Locator description or null for simple format
   */
  getLocatorDescription(pageName, elementName) {
    const locator = this.getLocator(pageName, elementName);
    if (typeof locator === 'object' && locator.description) {
      return locator.description;
    }
    return null;
  }

  /**
   * Get all locators for a page
   * @param {string} pageName - Page name
   * @returns {object} - All locators for the page
   */
  getPageLocators(pageName) {
    try {
      return this.locators[pageName];
    } catch (error) {
      console.error(`Page locators not found: ${pageName}`);
      throw new Error(`Page locators not found: ${pageName}`);
    }
  }

  /**
   * Get all locators
   * @returns {object} - All locators
   */
  getAllLocators() {
    return this.locators;
  }

  /**
   * Check if a page exists in locators
   * @param {string} pageName - Page name
   * @returns {boolean} - True if page exists
   */
  hasPage(pageName) {
    return pageName in this.locators;
  }

  /**
   * Check if an element exists in a page
   * @param {string} pageName - Page name
   * @param {string} elementName - Element name
   * @returns {boolean} - True if element exists
   */
  hasElement(pageName, elementName) {
    return this.locators[pageName] && elementName in this.locators[pageName];
  }

  // ==================== Convenience methods for common pages ====================

  /**
   * Get login page locators
   */
  getLoginPageLocators() {
    return this.locators.loginPage;
  }

  /**
   * Get dashboard page locators
   */
  getDashboardPageLocators() {
    return this.locators.dashboardPage;
  }

  /**
   * Get side menu locators
   */
  getSideMenuLocators() {
    return this.locators.sideMenu;
  }

  /**
   * Get time module locators
   */
  getTimeModuleLocators() {
    return this.locators.timeModule;
  }

  /**
   * Get timesheets locators
   */
  getTimesheetsLocators() {
    return this.locators.timesheets;
  }

  /**
   * Get my timesheet locators
   */
  getMyTimesheetLocators() {
    return this.locators.myTimesheet;
  }

  /**
   * Get edit timesheet locators
   */
  getEditTimesheetLocators() {
    return this.locators.editTimesheet;
  }

  /**
   * Get reports locators
   */
  getReportsLocators() {
    return this.locators.reports;
  }

  /**
   * Get common locators
   */
  getCommonLocators() {
    return this.locators.common;
  }

  // ==================== Recruitment module locators ====================

  /**
   * Get recruitment menu locator
   */
  getRecruitmentMenuLocator() {
    return this.locators.recruitmentMenu;
  }

  /**
   * Get view candidates page locators
   */
  getViewCandidatesPageLocators() {
    return this.locators.viewCandidatesPage;
  }

  /**
   * Get add candidate page locators
   */
  getAddCandidatePageLocators() {
    return this.locators.addCandidatePage;
  }

  /**
   * Get application stage page locators
   */
  getApplicationStagePageLocators() {
    return this.locators.applicationStagePage;
  }

  /**
   * Get shortlist candidate page locators
   */
  getShortlistCandidatePageLocators() {
    return this.locators.shortlistCandidatePage;
  }

  /**
   * Get schedule interview page locators
   */
  getScheduleInterviewPageLocators() {
    return this.locators.scheduleInterviewPage;
  }

  /**
   * Get profile menu locators
   */
  getProfileMenuLocators() {
    return this.locators.profileMenu;
  }

  /**
   * Get common locators (recruitment)
   */
  getCommonLocatorsRecruitment() {
    return this.locators.commonLocators;
  }

  /**
   * Reload all locators (useful for dynamic updates)
   */
  reload() {
    this.locators = {};
    this.loadAllLocators();
  }
}

// Export singleton instance
module.exports = new LocatorReader();
