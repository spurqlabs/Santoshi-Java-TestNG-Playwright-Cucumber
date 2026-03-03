const { Given, When, Then, After, setDefaultTimeout } = require('@cucumber/cucumber');
const pw = require('playwright');
const Loginpage = require('../../pages/Loginpage');
const MyTimesheetsPage = require('../../pages/MyTimesheetsPage');
const MyInfoPage = require('../../pages/MyInfoPage');
const log =  require('../../utils/logger');


setDefaultTimeout(60 * 1000);

  
  this.loginPage = new Loginpage(this.page);


 
Given('user is on OrangeHRM login page', async function () {

  await this.loginPage.goto(); 
});

When('user enter username', async function () {
   
  await this.loginPage.enterUsername();
});

When('user enter password', async function () {
  
  await this.loginPage.enterPassword();
});

When('user click on Login button', async function () {
  
  await this.loginPage.clickLogin();
});

Then('the user is logged in to the application', async function () {
  log.info('Checking if user is logged in');
});

Given('user is on Dashboard page', async function () {
  this.myTimesheets = new MyTimesheetsPage(this.page);
});

When('user navigates to Time -> Timesheets', async function () {
  
  await this.myTimesheets.navigateToTimesheets();
});

Then('ViewEmployeeTimesheet page is displayed', async function () {
  log.info('Checking if ViewEmployeeTimesheet page is displayed');
  
});

When('User click on Timesheet option', async function () {
  
  await this.myTimesheets.clickTimesheetsOption();
});

Then('Timesheet dropdown list is displayed', async function () {
  log.info('Checking if Timesheet dropdown list is displayed');
});

When('user select My Timesheets option from the Timesheet dropdown', async function () {
  
  await this.myTimesheets.clickMyTimesheetsOption();
});

Then('ViewMyTimesheet page is displayed', async function () {
  log.info('Checking if ViewMyTimesheet page is displayed');
});

When('User click on Edit button', async function () {
  
  await this.myTimesheets.clickEditButton();
});

Then('EditTimesheet page is displayed', async function () {
  log.info('Checking if EditTimesheet page is displayed');
});

When('User click on Cancel button', async function () {
  
  await this.myTimesheets.clickCancelButton();
});

Then('My Timesheet page is displayed', async function () {
  log.info('Checking if My Timesheet page is displayed');
});


 Given ('user is on dashbrd page', async function () {

  this.myInfoPage = new MyInfoPage(this.page);
 });

 When ('user click on My Info tab', async function () {
  await this.myInfoPage.clickonMyInfomenu();
});

Then ('viewPersonalDetails page is displayed with all personal details of the user', async function () {
  log.info("Checking if viewPersonalDetails page is displayed with all personal details of the user");
});


When ('user click on Contact Details subtab', async function () {
  await this.myInfoPage.clickContactDetailsTab();
});

 Then ('ContactDetails page is displayed', async function () {
  log.info("Checking if ContactDetails page is displayed");
 });



 When ('user enter steet1 {string}', async function (street1) {
  await this.myInfoPage.enterstreet1(street1);
 });



 When ('user enter city {string}', async function (city) {
  await this.myInfoPage.enterCity(city);
 });

When ('user enter state {string}', async function (state) {
  await this.myInfoPage.enterState(state);
});


  When ('user enter zip code {string}', async function (zipcode) {
  await this.myInfoPage.enterzipcode(zipcode);
  });


  When ('user enter country {string}', async function (country) {
  await this.myInfoPage.selectcountry(country);
  });


  When ('user enter mobile {string}', async function (mobile) {
  await this.myInfoPage.entermobile(mobile);
  });

  
  When ('user enter work phone {string}', async function (workphone) {
  await this.myInfoPage.enterworkmobile(workphone);
  });


  When ('user enter work email {string}', async function (workemail) {
  await this.myInfoPage.enterworkemail(workemail);
  });


  When ('user click on Save button', async function () {
  await this.myInfoPage.clicksavebutton();
  });

 Then ('Contact Details is saved successfully', async function () {
  log.info("Checking if Contact Details is saved successfully");
  });
