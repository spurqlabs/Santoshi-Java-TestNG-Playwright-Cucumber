const fs = require('fs');
const path = require('path');

/**
 * Test Data Reader - Reads and manages test data from multiple JSON files
 * This is a low-level utility that only handles data loading
 * Use ScenarioContext for scenario-specific test data access
 */
class TestDataReader {
  constructor() {
    this.testData = {};
    this.testDataFiles = ['timesheet.json', 'recruitment.json'];
    this.loadAllTestData();
  }

  /**
   * Load all test data files from the testdata directory
   */
  loadAllTestData() {
    const testDataDir = path.join(__dirname, '../testdata');
    
    // Load predefined test data files
    for (const file of this.testDataFiles) {
      this.loadTestDataFile(path.join(testDataDir, file));
    }

    // Also scan for any additional JSON files in the testdata directory
    try {
      const files = fs.readdirSync(testDataDir);
      for (const file of files) {
        if (file.endsWith('.json') && !this.testDataFiles.includes(file)) {
          this.loadTestDataFile(path.join(testDataDir, file));
        }
      }
    } catch (error) {
      console.error(`Error scanning testdata directory: ${error.message}`);
    }
  }

  /**
   * Load a single test data file
   * @param {string} filePath - Full path to the test data file
   */
  loadTestDataFile(filePath) {
    try {
      if (fs.existsSync(filePath)) {
        const rawData = fs.readFileSync(filePath, 'utf8');
        const data = JSON.parse(rawData);
        const fileName = data.fileName || path.basename(filePath, '.json');
        // Store test data indexed by fileName
        this.testData[fileName] = data;
        console.log(`Loaded test data from: ${path.basename(filePath)}`);
      }
    } catch (error) {
      console.error(`Failed to load test data file ${filePath}: ${error.message}`);
    }
  }

  /**
   * Get test data by file name and scenario name
   * @param {string} fileName - File name identifier (e.g., 'timesheetData', 'recruitment')
   * @param {string} scenarioName - Scenario name (e.g., 'TC001 - Login to application')
   * @returns {object} - Test data for the scenario
   */
  getTestData(fileName, scenarioName) {
    const fileData = this.testData[fileName];
    if (!fileData) {
      throw new Error(`Test data file not found: ${fileName}`);
    }
    const scenario = fileData.scenarios.find(
      (s) => s.scenarioName === scenarioName
    );
    if (!scenario) {
      throw new Error(`Scenario not found: ${scenarioName} in ${fileName}`);
    }
    return scenario.testData;
  }

  /**
   * Get test data by scenario name (searches across all files)
   * @param {string} scenarioName - Scenario name (e.g., 'TC001 - Login to application')
   * @returns {object} - Test data for the scenario
   */
  getTestDataByScenarioName(scenarioName) {
    for (const fileName of Object.keys(this.testData)) {
      const scenario = this.testData[fileName].scenarios.find(
        (s) => s.scenarioName === scenarioName
      );
      if (scenario) {
        return scenario.testData;
      }
    }
    throw new Error(`Scenario not found: ${scenarioName}`);
  }

  /**
   * Get test data by scenario identifier (partial match)
   * This allows finding test data by TC number or partial name
   * @param {string} scenarioIdentifier - Scenario identifier (e.g., 'TC001' or 'Login')
   * @returns {object} - Test data for the scenario
   */
  getTestDataByIdentifier(scenarioIdentifier) {
    for (const fileName of Object.keys(this.testData)) {
      const scenario = this.testData[fileName].scenarios.find(
        (s) => s.scenarioName.includes(scenarioIdentifier)
      );
      if (scenario) {
        return scenario.testData;
      }
    }
    throw new Error(`Scenario not found with identifier: ${scenarioIdentifier}`);
  }

  /**
   * Get test data by file name and scenario identifier
   * @param {string} fileName - File name identifier
   * @param {string} scenarioIdentifier - Scenario identifier (e.g., 'TC001' or 'Login')
   * @returns {object} - Test data for the scenario
   */
  getTestDataByFileAndIdentifier(fileName, scenarioIdentifier) {
    const fileData = this.testData[fileName];
    if (!fileData) {
      throw new Error(`Test data file not found: ${fileName}`);
    }
    const scenario = fileData.scenarios.find(
      (s) => s.scenarioName.includes(scenarioIdentifier)
    );
    if (!scenario) {
      throw new Error(`Scenario not found with identifier: ${scenarioIdentifier} in ${fileName}`);
    }
    return scenario.testData;
  }

  /**
   * Get all scenarios from a specific file
   * @param {string} fileName - File name identifier
   * @returns {array} - All scenarios from the file
   */
  getScenariosByFile(fileName) {
    const fileData = this.testData[fileName];
    if (!fileData) {
      throw new Error(`Test data file not found: ${fileName}`);
    }
    return fileData.scenarios;
  }

  /**
   * Get all scenarios across all files
   * @returns {array} - All scenarios
   */
  getAllScenarios() {
    let allScenarios = [];
    for (const fileName of Object.keys(this.testData)) {
      allScenarios = allScenarios.concat(this.testData[fileName].scenarios);
    }
    return allScenarios;
  }

  /**
   * Get file name for a specific test data file
   * @param {string} fileKey - File key (e.g., 'timesheetData', 'recruitment')
   * @returns {string} - File name
   */
  getFileName(fileKey) {
    const fileData = this.testData[fileKey];
    if (!fileData) {
      throw new Error(`Test data file not found: ${fileKey}`);
    }
    return fileData.fileName;
  }

  /**
   * Get all loaded file names
   * @returns {array} - Array of file names
   */
  getAllFileNames() {
    return Object.keys(this.testData);
  }

  /**
   * Check if a file exists
   * @param {string} fileName - File name
   * @returns {boolean} - True if file exists
   */
  hasFile(fileName) {
    return fileName in this.testData;
  }

  /**
   * Check if scenario exists in a specific file
   * @param {string} fileName - File name
   * @param {string} scenarioName - Scenario name
   * @returns {boolean} - True if scenario exists
   */
  hasScenarioInFile(fileName, scenarioName) {
    const fileData = this.testData[fileName];
    if (!fileData) return false;
    return fileData.scenarios.some((s) => s.scenarioName === scenarioName);
  }

  /**
   * Check if scenario exists (searches all files)
   * @param {string} scenarioName - Scenario name
   * @returns {boolean} - True if scenario exists
   */
  hasScenario(scenarioName) {
    for (const fileName of Object.keys(this.testData)) {
      if (this.testData[fileName].scenarios.some((s) => s.scenarioName === scenarioName)) {
        return true;
      }
    }
    return false;
  }

  /**
   * Get credentials from any scenario that has username and password
   * This is used as fallback when current scenario doesn't have credentials
   * @returns {object} - Object with username and password
   */
  getCredentials() {
    // Find first scenario that has username and password
    for (const fileName of Object.keys(this.testData)) {
      const scenario = this.testData[fileName].scenarios.find(
        (s) => s.testData && s.testData.username && s.testData.password
      );
      if (scenario) {
        return {
          username: scenario.testData.username,
          password: scenario.testData.password
        };
      }
    }
    throw new Error('No scenario found with username and password');
  }

  /**
   * Get timesheet test data
   * @returns {object} - Timesheet test data object
   */
  getTimesheetData() {
    return this.testData.timesheetData || this.testData.timesheet;
  }

  /**
   * Get recruitment test data
   * @returns {object} - Recruitment test data object
   */
  getRecruitmentData() {
    return this.testData.recruitment;
  }

  /**
   * Reload all test data (useful for dynamic updates)
   */
  reload() {
    this.testData = {};
    this.loadAllTestData();
  }
}

// Export singleton instance
module.exports = new TestDataReader();
