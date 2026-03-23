const { Given, When, Then } = require('@cucumber/cucumber');
const { expect } = require('@playwright/test');
const LoginPage = require('../../pages/LoginPage');
const AddCandidatePage = require('../../pages/AddCandidatePage');
const ViewCandidatePage = require('../../pages/ViewCandidatePage');

let loginPage;
let addCandidatePage;
let viewCandidatePage;

// ==================== Background Steps ====================
// Note: Background steps are already defined in timesheet.steps.js
// They will be reused across feature files

// ==================== TC003 - Add Candidate details ====================

Given('user is on dashboard page', async function () {
  loginPage = new LoginPage(this.page, this.scenarioContext);
  addCandidatePage = new AddCandidatePage(this.page, this.scenarioContext);
  const isDashboardDisplayed = await loginPage.isDashboardDisplayed();
  expect(isDashboardDisplayed).toBe(true);
});

When('user click on Recruitment menu', async function () {
  await addCandidatePage.clickRecruitmentMenu();
});

Then('user navigate to viewCandidates page', async function () {
  const isDisplayed = await addCandidatePage.isViewCandidatesPageDisplayed();
  expect(isDisplayed).toBe(true);
});

When('user click on Add button', async function () {
  await addCandidatePage.clickAddButton();
});

Then('user navigate to addCandidate page', async function () {
  const isDisplayed = await addCandidatePage.isAddCandidatePageDisplayed();
  expect(isDisplayed).toBe(true);
});

When('user enter First Name', async function () {
  // Page class handles scenarioContext.getData internally
  await addCandidatePage.enterFirstName();
});

When('user enter Last Name', async function () {
  // Page class handles scenarioContext.getData internally
  await addCandidatePage.enterLastName();
});

When('user select Job Vacancy', async function () {
  // Page class handles scenarioContext.getData internally
  await addCandidatePage.selectJobVacancy();
});

When('user enter Email', async function () {
  // Page class handles scenarioContext.getData internally
  await addCandidatePage.enterEmail();
});

When('user enter Contact Number', async function () {
  // Page class handles scenarioContext.getData internally
  await addCandidatePage.enterContactNumber();
});

When('user upload Resume', async function () {
  // Page class handles scenarioContext.getData internally
  await addCandidatePage.uploadResume();
});

When('user click on Savebutton', async function () {
  await addCandidatePage.clickSaveButtonAndWait();
});

Then('the candidate details is added successfully', async function () {
  const isAdded = await addCandidatePage.isSuccessToastDisplayed();
  expect(isAdded).toBe(true);
});

// ==================== TC004 - View Candidate details, download resume, schedule Interview ====================

Given('user is on home page', async function () {
  loginPage = new LoginPage(this.page, this.scenarioContext);
  addCandidatePage = new AddCandidatePage(this.page, this.scenarioContext);
  viewCandidatePage = new ViewCandidatePage(this.page, this.scenarioContext);
  const isDashboardDisplayed = await loginPage.isDashboardDisplayed();
  expect(isDashboardDisplayed).toBe(true);
});

When('user click on Recruit_menu', async function () {
  await addCandidatePage.clickRecruitmentMenu();
});

Then('user navigate to recruitment page', async function () {
  const isDisplayed = await addCandidatePage.isViewCandidatesPageDisplayed();
  expect(isDisplayed).toBe(true);
});

When('user added a new candidate', async function () {
  // Navigate to Add Candidate page and add candidate
  // Page class handles scenarioContext.getData internally
  await addCandidatePage.clickAddButton();
  await addCandidatePage.isAddCandidatePageDisplayed();
  await addCandidatePage.enterFirstName();
  await addCandidatePage.enterLastName();
  await addCandidatePage.selectJobVacancy();
  await addCandidatePage.enterEmail();
  await addCandidatePage.enterContactNumber();
  await addCandidatePage.uploadResume();
  await addCandidatePage.clickSaveButton();
 });

Then('candidate is created sucessfully', async function () {
  const isAdded = await addCandidatePage.isSuccessToastDisplayed();
  expect(isAdded).toBe(true);
});

When('user click on download button for resume', async function () {
  await viewCandidatePage.clickDownloadResumeButton();
});

Then('the resume is downloaded successfully', async function () {
  const isDownloaded = await viewCandidatePage.verifyResumeDownloaded();
  expect(isDownloaded).toBe(true);
});

When('user click on Shortlist button', async function () {
  await viewCandidatePage.clickShortlistButton();
});

Then('user navigate to changeCandidateVacancyStatus page', async function () {
  await viewCandidatePage.verifyShortlistCandidatePageDisplayed();
});

When('user enter Notes and click save_BTN', async function () {
  // Page class handles scenarioContext.getData internally
  await viewCandidatePage.enterShortlistNotes();
  await viewCandidatePage.clickShortlistSaveButton();
});

Then('entered details are saved and navigate to addCandidate page', async function () {
  await viewCandidatePage.assertApplicationStagePageDisplayed();
});

When('user click on Schedule Interview button', async function () {
  await viewCandidatePage.clickScheduleInterviewButton();
});

Then('user navigate to Schedule Interview page for the entered interview details', async function () {
  await viewCandidatePage.verifyScheduleInterviewPageDisplayed();
});

When('user enter interview schedule details and click_SAVE', async function () {
  // Page class handles scenarioContext.getData internally
  await viewCandidatePage.enterInterviewScheduleDetailsAndSave();
});

Then('entered interview details are saved and navigate to Applcation stage page with Interview Scheduled status', async function () {
  await viewCandidatePage.verifyApplicationStageWithInterviewStatus();
});

When('user click on Logout button from profile menu', async function () {
  await viewCandidatePage.performLogout();
});

Then('user is logged out from the application', async function () {
  await viewCandidatePage.verifyLoggedOut();
});
