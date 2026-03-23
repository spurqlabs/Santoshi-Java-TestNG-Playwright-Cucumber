const { Given, When, Then } = require('@cucumber/cucumber');
const { expect } = require('@playwright/test');
const LoginPage = require('../../pages/LoginPage');
const MyTimesheetPage = require('../../pages/MyTimesheetPage');

let loginPage;
let myTimesheetPage;

// ==================== Background Steps ====================

Given('user is on OrangeHRM login page', async function () {
  loginPage = new LoginPage(this.page, this.scenarioContext);
  await loginPage.navigateToLoginPage();
});

When('user enter username', async function () {
  // Page class handles scenarioContext.getData internally
  const username = this.scenarioContext.getData('username');
  await loginPage.enterUsername(username);
});

When('user enter password', async function () {
  // Page class handles scenarioContext.getData internally
  const password = this.scenarioContext.getData('password');
  await loginPage.enterPassword(password);
});

When('user click on Login button', async function () {
  await loginPage.clickLoginButton();
});

Then('the user is logged in to the application', async function () {
  const isDashboardDisplayed = await loginPage.isDashboardDisplayed();
  expect(isDashboardDisplayed).toBe(true);
});

// ==================== TC001 - Login to application ====================
// This scenario uses the background steps only

// ==================== TC002 - Add Timesheet details ====================

Given('user is on Dashboard page', async function () {
  myTimesheetPage = new MyTimesheetPage(this.page, this.scenarioContext);
  const isDashboardDisplayed = await loginPage.isDashboardDisplayed();
  expect(isDashboardDisplayed).toBe(true);
});

When('user navigates to Time -> Timesheets', async function () {
  await myTimesheetPage.navigateToTimeModule();
});

Then('ViewEmployeeTimesheet page is displayed', async function () {
  const isDisplayed = await myTimesheetPage.isViewEmployeeTimesheetPageDisplayed();
  expect(isDisplayed).toBe(true);
});

When('User click on Timesheet option', async function () {
  await myTimesheetPage.clickTimesheetsMenu();
});

Then('Timesheet dropdown list is displayed', async function () {
  const isDisplayed = await myTimesheetPage.isTimesheetDropdownDisplayed();
  expect(isDisplayed).toBe(true);
});

When('user select My Timesheets option from the Timesheet dropdown', async function () {
  await myTimesheetPage.selectMyTimesheets();
});

Then('ViewMyTimesheet page is displayed', async function () {
  const isDisplayed = await myTimesheetPage.isViewMyTimesheetPageDisplayed();
  expect(isDisplayed).toBe(true);
});

When('User click on Edit button', async function () {
  await myTimesheetPage.clickEditButton();
});

Then('EditTimesheet page is displayed', async function () {
  const isDisplayed = await myTimesheetPage.isEditTimesheetPageDisplayed();
  expect(isDisplayed).toBe(true);
});

When('user enter project name', async function () {
  // Page class handles scenarioContext.getData internally
  await myTimesheetPage.selectProject();
});

When('user enter activity name', async function () {
  // Page class handles scenarioContext.getData internally
  await myTimesheetPage.selectActivity();
});

When('user enter time duration', async function () {
  // Page class handles scenarioContext.getData internally
  await myTimesheetPage.enterTimeDuration();
});

When('user click on Save button', async function () {
  await myTimesheetPage.clickSaveButton();
});

Then('Timesheet details are saved successfully', async function () {
  const isSaved = await myTimesheetPage.isTimesheetSavedSuccessfully();
  expect(isSaved).toBe(true);
});
