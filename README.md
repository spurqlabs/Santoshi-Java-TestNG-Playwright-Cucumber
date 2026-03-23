# Playwright JavaScript BDD Automation Framework

A robust, scalable, and maintainable test automation framework built with **Playwright**, **Cucumber (BDD)**, and **JavaScript** following the Page Object Model (POM) design pattern.

## Table of Contents

- [Framework Overview](#framework-overview)
- [Architecture](#architecture)
- [Project Structure](#project-structure)
- [Key Features](#key-features)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Running Tests](#running-tests)
- [Configuration](#configuration)
- [Page Object Model](#page-object-model)
- [Assertion Library](#assertion-library)
- [Writing Tests](#writing-tests)
- [Test Data Management](#test-data-management)
- [Locators Management](#locators-management)
- [Logging](#logging)
- [Reports](#reports)
- [Best Practices](#best-practices)
- [Troubleshooting](#troubleshooting)

---

## Framework Overview

This framework is designed to automate web application testing using Behavior Driven Development (BDD) principles. It combines the power of Playwright for browser automation with Cucumber for BDD-style test writing.

### Technology Stack

| Component | Technology |
|-----------|------------|
| Browser Automation | Playwright |
| BDD Framework | Cucumber.js |
| Programming Language | JavaScript (Node.js) |
| Design Pattern | Page Object Model (POM) |
| Assertion Library | Node.js Assert (Built-in) |
| Reporting | Cucumber HTML Reporter |
| Logging | Custom Logger |

---

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        Feature Files (.feature)                  │
│                    (Gherkin Syntax - BDD Scenarios)              │
└─────────────────────────────┬───────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      Step Definitions                            │
│              (Connects Gherkin steps to code)                    │
└─────────────────────────────┬───────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      Page Objects                                │
│           (Encapsulates page elements and actions)               │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────────┐  │
│  │  BasePage   │  │  LoginPage  │  │  MyTimesheetPage        │  │
│  │  (Common)   │  │             │  │                         │  │
│  └─────────────┘  └─────────────┘  └─────────────────────────┘  │
└─────────────────────────────┬───────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      Utilities                                   │
│  ┌──────────────┐ ┌──────────────┐ ┌────────────────────────┐   │
│  │ ConfigManager│ │ LocatorReader│ │ TestdataReader         │   │
│  └──────────────┘ └──────────────┘ └────────────────────────┘   │
│  ┌──────────────┐ ┌──────────────┐                              │
│  │BrowserManager│ │   Logger     │                              │
│  └──────────────┘ └──────────────┘                              │
└─────────────────────────────┬───────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    External Resources                            │
│  ┌──────────────┐ ┌──────────────┐ ┌────────────────────────┐   │
│  │  config.json │ │ locators.json│ │ test-data.json         │   │
│  └──────────────┘ └──────────────┘ └────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

---

## Project Structure

```
Playwright-Javascript-BDD/
├── config/
│   └── config.json              # Environment and browser configuration
├── features/
│   ├── timesheet.feature        # BDD feature files (Gherkin syntax)
│   ├── Hooks/
│   │   └── hooks.js             # Cucumber hooks (Before, After, etc.)
│   └── stepdef/
│       └── timesheet.steps.js   # Step definitions
├── locators/
│   └── locators.json            # Centralized element locators
├── pages/
│   ├── BasePage.js              # Base page with common methods
│   ├── LoginPage.js             # Login page object
│   └── MyTimesheetPage.js       # Timesheet page object
├── reports/
│   ├── cucumber-report.html     # HTML test report
│   ├── cucumber-report.json     # JSON test report
│   ├── screenshots/             # Failure screenshots
│   ├── videos/                  # Test execution videos
│   └── traces/                  # Playwright traces
├── test-data/
│   └── test-data.json           # Test data for scenarios
├── utils/
│   ├── browserManager.js        # Browser initialization and management
│   ├── configManager.js         # Configuration reader
│   ├── locatorReader.js         # Locator reader utility
│   ├── logger.js                # Custom logging utility
│   └── testdataReader.js        # Test data reader utility
├── cucumber.js                  # Cucumber configuration
├── playwright.config.js         # Playwright configuration
├── package.json                 # Project dependencies and scripts
└── README.md                    # This documentation file
```

---

## Key Features

### 1. **Behavior Driven Development (BDD)**
- Write tests in plain English using Gherkin syntax
- Features, Scenarios, Given/When/Then steps
- Easy collaboration between technical and non-technical team members

### 2. **Page Object Model (POM)**
- Separates test logic from page structure
- Reusable page components
- Easy maintenance when UI changes

### 3. **Centralized Configuration**
- Environment-specific settings in `config.json`
- Easy to switch between environments
- Configurable browser settings

### 4. **Externalized Locators**
- All element locators stored in `locators.json`
- Easy to update when UI changes
- Support for multiple locator strategies

### 5. **Data-Driven Testing**
- Test data stored in `test-data.json`
- Support for multiple test scenarios
- Easy to add new test data

### 6. **Node.js Assert Library**
- Built-in assertion module
- Clean and simple assertion syntax
- Detailed error messages

### 7. **Comprehensive Logging**
- Step-by-step execution logs
- Assertion logging
- Error logging with screenshots

### 8. **Rich Reporting**
- HTML reports with screenshots
- JSON reports for CI/CD integration
- Video recording of test execution

---

## Prerequisites

- **Node.js** >= 16.x
- **npm** >= 8.x
- **Git** (optional, for version control)

---

## Installation

### 1. Clone the repository
```bash
git clone <repository-url>
cd Playwright-Javascript-BDD
```

### 2. Install dependencies
```bash
npm install
```

### 3. Install Playwright browsers
```bash
npx playwright install
```

---

## Running Tests

### Run all tests
```bash
npm test
```

### Run tests in headed mode (visible browser)
```bash
npm run test:headed
```

### Run tests in parallel
```bash
npm run test:parallel
```

### Run tests with HTML report
```bash
npm run test:report
```

### Run specific feature file
```bash
npx cucumber-js features/timesheet.feature
```

### Run tests with specific tags
```bash
npx cucumber-js --tags "@smoke"
npx cucumber-js --tags "@regression"
```

---

## Configuration

### config/config.json

```json
{
  "baseUrl": "https://opensource-demo.orangehrmlive.com",
  "loginPath": "/web/index.php/auth/login",
  "timeout": 30000,
  "browser": {
    "type": "chromium",
    "headless": false,
    "slowMo": 800
  }
}
```

| Property | Description |
|----------|-------------|
| `baseUrl` | Base URL of the application under test |
| `loginPath` | Login page path |
| `timeout` | Default timeout in milliseconds |
| `browser.type` | Browser to use (chromium, firefox, webkit) |
| `browser.headless` | Run in headless mode (true/false) |
| `browser.slowMo` | Slow down execution by specified milliseconds |

### cucumber.js

```javascript
module.exports = {
  default: {
    requireModule: ['@babel/register'],
    require: ['features/Hooks/hooks.js', 'features/stepdef/*.js'],
    paths: ['features/*.feature'],
    format: ['pretty', 'html:reports/cucumber-report.html'],
    timeout: 60000,
    publishQuiet: true
  }
};
```

---

## Page Object Model

### BasePage.js

The `BasePage` class contains common methods inherited by all page objects:

```javascript
const assert = require('assert');
const Logger = require('../utils/logger');

class BasePage {
  constructor(page) {
    this.page = page;
    this.timeout = configManager.getTimeout();
  }

  // Navigation
  async navigateTo(url) { ... }
  
  // Element interactions
  async waitForElement(selector) { ... }
  async click(selector) { ... }
  async fill(selector, value) { ... }
  async getText(selector) { ... }
  async isVisible(selector) { ... }
  
  // Assertion methods
  async assertElementVisible(selector, message) { ... }
  async assertElementText(selector, expectedText, message) { ... }
  async assertInputValue(selector, expectedValue, message) { ... }
  async assertUrlContains(expectedPath, message) { ... }
  // ... more assertion methods
}
```

### LoginPage.js

```javascript
class LoginPage extends BasePage {
  constructor(page) {
    super(page);
    this.locators = locatorReader.getLoginPageLocators();
  }

  // Actions
  async navigateToLoginPage() { ... }
  async enterUsername(username) { ... }
  async enterPassword(password) { ... }
  async clickLoginButton() { ... }
  async login(username, password) { ... }
  
  // Assertions
  async assertLoginPageDisplayed(message) { ... }
  async assertLoginSuccessful(message) { ... }
  async assertUsernameValue(expectedValue, message) { ... }
}
```

### MyTimesheetPage.js

```javascript
class MyTimesheetPage extends BasePage {
  constructor(page) {
    super(page);
    this.timeModuleLocators = locatorReader.getTimeModuleLocators();
    this.timesheetsLocators = locatorReader.getTimesheetsLocators();
    // ... more locators
  }

  // Actions
  async navigateToTimeModule() { ... }
  async selectProject(projectName) { ... }
  async selectActivity(activity) { ... }
  async enterTimeDuration(hours) { ... }
  async clickSaveButton() { ... }
  
  // Assertions
  async assertTimesheetSavedSuccessfully(message) { ... }
  async assertEditTimesheetPageDisplayed(message) { ... }
}
```

---

## Assertion Library

This framework uses **Node.js built-in `assert` module** for assertions. This provides a clean, simple, and dependency-free approach to validations.

### Assertion Pattern

```javascript
const assert = require('assert');

// Assert input value
const locator = this.page.locator(selector);
const actualValue = await locator.inputValue();
assert.equal(actualValue, expectedValue, 'Custom error message');

// Assert element visibility
const isVisible = await locator.isVisible();
assert.equal(isVisible, true, 'Element should be visible');

// Assert text contains
const actualText = await locator.textContent();
assert.ok(actualText.includes(expectedText), 'Text should contain value');
```

### Available Assertion Methods in BasePage

| Method | Description |
|--------|-------------|
| `assertElementVisible(selector, message)` | Assert element is visible |
| `assertElementNotVisible(selector, message)` | Assert element is not visible |
| `assertElementEnabled(selector, message)` | Assert element is enabled |
| `assertElementDisabled(selector, message)` | Assert element is disabled |
| `assertElementText(selector, expectedText, message)` | Assert element text equals |
| `assertElementContainsText(selector, expectedText, message)` | Assert element contains text |
| `assertInputValue(selector, expectedValue, message)` | Assert input field value |
| `assertInputEmpty(selector, message)` | Assert input field is empty |
| `assertUrl(expectedUrl, message)` | Assert URL equals |
| `assertUrlContains(expectedPath, message)` | Assert URL contains path |
| `assertTitle(expectedTitle, message)` | Assert page title equals |
| `assertTitleContains(expectedText, message)` | Assert page title contains text |
| `assertElementCount(selector, expectedCount, message)` | Assert element count |
| `assertCheckboxChecked(selector, message)` | Assert checkbox is checked |
| `assertEqual(actual, expected, message)` | Assert two values are equal |
| `assertTrue(condition, message)` | Assert condition is true |
| `assertFalse(condition, message)` | Assert condition is false |

### Example Usage in Page Objects

```javascript
// In LoginPage.js
async assertUsernameValue(expectedValue, message = 'Username field should have expected value') {
  Logger.assertion(`Asserting username field value: ${expectedValue}`);
  const locator = this.page.locator(this.locators.usernameInput);
  await locator.waitFor({ state: 'visible', timeout: this.timeout });
  const actualValue = await locator.inputValue();
  assert.equal(actualValue, expectedValue, message);
  Logger.info(`Assertion passed: Username field has value "${expectedValue}"`);
}
```

---

## Writing Tests

### Feature File (Gherkin Syntax)

Create a `.feature` file in the `features/` directory:

```gherkin
Feature: My Timesheet Management in OrangeHRM

Background:
  Given user is on OrangeHRM login page
  When user enter username
  When user enter password
  When user click on Login button
  Then the user is logged in to the application

@smoke
Scenario: TC001 - Login to application
  Then the user is logged in to the application

@regression
Scenario: TC002 - Add Timesheet details
  Given user is on Dashboard page
  When user navigates to Time -> Timesheets
  Then ViewEmployeeTimesheet page is displayed
  When user select My Timesheets option from the Timesheet dropdown
  Then ViewMyTimesheet page is displayed
  When User click on Edit button
  Then EditTimesheet page is displayed
  When user enter project name
  When user enter activity name
  When user enter time duration
  When user click on Save button
  Then Timesheet details are saved successfully
```

### Step Definitions

Create step definitions in `features/stepdef/`:

```javascript
const { Given, When, Then } = require('@cucumber/cucumber');
const assert = require('assert');
const LoginPage = require('../../pages/LoginPage');
const MyTimesheetPage = require('../../pages/MyTimesheetPage');

let loginPage;
let myTimesheetPage;

Given('user is on OrangeHRM login page', async function () {
  loginPage = new LoginPage(this.page);
  await loginPage.navigateToLoginPage();
});

When('user enter username', async function () {
  await loginPage.enterUsername();
});

Then('the user is logged in to the application', async function () {
  const isDashboardDisplayed = await loginPage.isDashboardDisplayed();
  assert.equal(isDashboardDisplayed, true, 'User should be logged in');
});
```

---

## Test Data Management

### test-data/test-data.json

```json
{
  "fileName": "timesheetData",
  "scenarios": [
    {
      "scenarioName": "TC001 - Login to application",
      "testData": {
        "username": "Admin",
        "password": "admin123"
      }
    },
    {
      "scenarioName": "TC002 - Add Timesheet details",
      "testData": {
        "projectName": "ACME",
        "activity": "Feature Development",
        "mondayHours": "8",
        "tuesdayHours": "8",
        "wednesdayHours": "8",
        "thursdayHours": "8",
        "fridayHours": "8",
        "saturdayHours": "0",
        "sundayHours": "0"
      }
    }
  ]
}
```

### Using Test Data in Page Objects

```javascript
const testdataReader = require('../utils/testdataReader');

async enterUsername(username) {
  if (!username) {
    const loginData = testdataReader.getLoginTestData();
    username = loginData.username;
  }
  await this.fill(this.locators.usernameInput, username);
}
```

---

## Locators Management

### locators/locators.json

```json
{
  "loginPage": {
    "usernameInput": "input[name='username']",
    "passwordInput": "input[name='password']",
    "loginButton": "button[type='submit']",
    "errorMessage": ".oxd-alert-content-text"
  },
  "dashboardPage": {
    "dashboardHeader": ".oxd-topbar-header-breadcrumb h6",
    "userProfileDropdown": ".oxd-userdropdown-name"
  },
  "common": {
    "toastSuccess": ".oxd-toast--success",
    "toastError": ".oxd-toast--error",
    "toastMessage": ".oxd-toast-content-text"
  }
}
```

### Using Locators in Page Objects

```javascript
const locatorReader = require('../utils/locatorReader');

class LoginPage extends BasePage {
  constructor(page) {
    super(page);
    this.locators = locatorReader.getLoginPageLocators();
  }
  
  async enterUsername(username) {
    await this.fill(this.locators.usernameInput, username);
  }
}
```

---

## Logging

The framework includes a custom logger that provides detailed execution logs:

```javascript
const Logger = require('../utils/logger');

// Log levels
Logger.info('Information message');
Logger.step('Step description');
Logger.assertion('Assertion description');
Logger.warn('Warning message');
Logger.error('Error message');
Logger.debug('Debug message');
```

### Log Output Example

```
[INFO] Starting login process
[STEP] Entering username: Admin
[INFO] Username entered successfully
[STEP] Clicking login button
[ASSERTION] Asserting dashboard is displayed
[INFO] Assertion passed: Dashboard is displayed
```

---

## Reports

### HTML Report

After running tests with `npm run test:report`, open:

```
reports/cucumber-report.html
```

### Report Contents

- Test execution summary
- Passed/Failed scenario counts
- Step-by-step execution details
- Screenshots for failed scenarios
- Execution time for each scenario

### Screenshots

Failed scenarios automatically capture screenshots:

```
reports/screenshots/failure-TC002---Add-Timesheet-details-1773234786173.png
```

### Videos

Test execution videos are saved:

```
reports/videos/1adba7b0787f21d3effeeaf98de8b1cc.webm
```

---

## Best Practices

### 1. Page Object Model

- Keep locators in `locators.json`
- Create methods for each user action
- Create assertion methods for validations
- Inherit from `BasePage` for common functionality

### 2. BDD Best Practices

- Write declarative scenarios, not imperative
- Use meaningful step names
- Keep scenarios focused and independent
- Use tags for test categorization

### 3. Assertions

- Use the built-in `assert` module
- Provide meaningful error messages
- Log assertions for debugging

```javascript
// Good
assert.equal(actualValue, expectedValue, 'Username value does not match');

// Avoid
assert.equal(actualValue, expectedValue);
```

### 4. Test Data

- Store test data externally in JSON files
- Use meaningful scenario names
- Keep test data organized by feature

### 5. Locators

- Use stable locators (data-testid, name, id)
- Avoid using fragile locators (xpath with indices)
- Group locators by page in `locators.json`

---

## Troubleshooting

### Common Issues

#### 1. Browser not launching

```bash
# Install Playwright browsers
npx playwright install
```

#### 2. Timeout errors

Increase timeout in `config.json`:

```json
{
  "timeout": 60000
}
```

#### 3. Element not found

- Check if the locator is correct in `locators.json`
- Add explicit waits if needed
- Check if the element is in an iframe

#### 4. Tests failing in headless mode

- Set `headless: false` for debugging
- Check for dynamic content loading
- Add appropriate waits

### Debug Mode

Run tests in headed mode with slow motion:

```json
{
  "browser": {
    "headless": false,
    "slowMo": 1000
  }
}
```

---

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

---

## License

This project is licensed under the MIT License.

---

## Contact

For questions or support, please contact the development team.

---

**Happy Testing! 🚀**
