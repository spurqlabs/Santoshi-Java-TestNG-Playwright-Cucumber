const { Before, After, BeforeAll, AfterAll, Status, setDefaultTimeout } = require('@cucumber/cucumber');

// Set default timeout for all step definitions (60 seconds)
setDefaultTimeout(60 * 1000);
const BrowserManager = require('../../utils/browserManager');
const configManager = require('../../utils/configManager');
const ScenarioContext = require('../../utils/ScenarioContext');
const fs = require('fs');
const path = require('path');

let browserManager;

/**
 * Before All - Initialize browser once before all tests
 */
BeforeAll(async function () {
  console.log('========================================');
  console.log('Starting Test Execution');
  console.log(`Base URL: ${configManager.getBaseUrl()}`);
  console.log(`Browser: ${configManager.getBrowserType()}`);
  console.log(`Headless: ${configManager.isHeadless()}`);
  console.log('========================================');
  
  // Create reports directories if not exist
  const dirs = ['reports', 'reports/screenshots', 'reports/videos', 'reports/traces'];
  dirs.forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });
});

/**
 * Before - Initialize browser before each scenario
 */
Before(async function (scenario) {
  console.log(`\nStarting Scenario: ${scenario.pickle.name}`);
  console.log(`Timeout: ${configManager.getTimeout()}ms`);
  
  browserManager = new BrowserManager();
  this.page = await browserManager.initializeBrowser();
  this.browserManager = browserManager;
  this.configManager = configManager;
  
  // Initialize ScenarioContext for reading testdata and locators
  this.scenarioContext = new ScenarioContext();
  this.scenarioContext.initializeScenario(scenario.pickle.name);
  console.log(`ScenarioContext initialized for: ${scenario.pickle.name}`);
});

/**
 * After - Cleanup after each scenario
 */
After(async function (scenario) {
  console.log(`Completed Scenario: ${scenario.pickle.name} - Status: ${scenario.result.status}`);
  
  // Take screenshot on failure
  if (scenario.result.status === Status.FAILED) {
    const screenshotName = `failure-${scenario.pickle.name.replace(/\s+/g, '-')}-${Date.now()}`;
    const screenshotPath = `reports/screenshots/${screenshotName}.png`;
    
    if (this.page) {
      await this.page.screenshot({ path: screenshotPath, fullPage: true });
      console.log(`Screenshot saved: ${screenshotPath}`);
      
      // Attach screenshot to report
      this.attach(fs.readFileSync(screenshotPath), 'image/png');
    }
  }
  
  // Close browser
  if (browserManager) {
    await browserManager.closeBrowser();
  }
});

/**
 * After All - Cleanup after all tests
 */
AfterAll(async function () {
  console.log('\n========================================');
  console.log('Test Execution Completed');
  console.log('========================================');
});
