const { Before, After, AfterStep, setDefaultTimeout } = require('@cucumber/cucumber');
const { chromium, firefox, webkit } = require('playwright');
const Loginpage = require('../../pages/Loginpage');
const MyTimesheetsPage = require('../../pages/MyTimesheetsPage');
const MyInfoPage = require('../../pages/MyInfoPage');

setDefaultTimeout(60 * 1000);

Before(async function () {

this.browser = await chromium.launch({
  headless: false,
  slowMo: 2000,   // 1000 milliseconds = 1 second delay
  args: ['--start-maximized']
});
  this.context = await this.browser.newContext({
    viewport: null
});

  this.page = await this.context.newPage();

  // 🔥 Add Page Object Here
  this.loginPage = new Loginpage(this.page); 
  this.mytimesheetpage = new MyTimesheetsPage(this.page);
  this.myInfoPage = new MyInfoPage(this.page);


  await this.page.goto('https://opensource-demo.orangehrmlive.com/');

});

After(async function () {

  if (this.page) await this.page.close();
  if (this.context) await this.context.close();
  if (this.browser) await this.browser.close();

});

AfterStep(async function () {
  if (!this.page) return;

  const screenshot = await this.page.screenshot();
  await this.attach(screenshot, 'image/png');
});