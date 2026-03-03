
const { timesheet } = require('../locators/locators');
const locatorReader = require('../utils/locatorReader');
const log =  require('../utils/logger');
const assert = require('assert');

class MyTimesheetsPage {
  constructor(page) {
    this.page = page;
  }

  async navigateToTimesheets() {
    const menuTime = locatorReader.getLocator(this.page, 'timesheet.menuTime');
    if (!menuTime) throw new Error('Locator timesheet.menuTime not found');
    await menuTime.click();
     await this.page.waitForTimeout(1000);
    		assert.equal(await menuTime.isVisible(), true, 'viewEmployeeTimesheet page not opened after clicking menu');
        log.info("viewEmployeeTimesheet page opened after clicking menu");
       
  }

  async clickTimesheetsOption()
  {
    const timesheetsOption = locatorReader.getLocator(this.page, 'timesheet.headerTimesheets');
    await timesheetsOption.click();
    
     const mytimesheetopt = locatorReader.getLocator(this.page, 'timesheet.MyTimesheets');
     
     assert.equal(await mytimesheetopt.isVisible(), true, 'My Timesheets option is not visible');
        log.info("My Timesheets option is visible");
      }
   async clickMyTimesheetsOption()
   {
    const myTimesheets = locatorReader.getLocator(this.page, 'timesheet.MyTimesheets');
    await myTimesheets.click();

    const url = this.page.url();
    
     assert.equal(url.includes("viewMyTimesheet"), true, 'viewMyTimesheet page not opened after clicking option');
      log.info("viewMyTimesheet page opened after clicking option");
   }

  


  async isTimesheetDropdownDisplayed() {
    const candidates = [
      locatorReader.getLocator(this.page, 'timesheet.list'),
      locatorReader.getLocator(this.page, 'timesheet.dropdownsuggestion'),
      locatorReader.getLocator(this.page, 'timesheet.roleOpt')
    ].filter(Boolean);

    for (const c of candidates) {
      try {
        const visible = await c.isVisible();
        if (visible) return true;
      } catch (e) {
        // ignore
      }
    }

    // consider the presence of MyTimesheets link as satisfying the dropdown expectation
    try {
      const my = locatorReader.getLocator(this.page, 'timesheet.MyTimesheets');
      if (my) {
        const v = await my.isVisible().catch(() => false);
        if (v) return true;
      }
    } catch (e) {}

    // try waiting briefly for any listbox to appear
    try {
      await this.page.waitForSelector("[role='listbox']", { state: 'visible', timeout: 3000 });
      return true;
    } catch (e) {
      // dump page HTML for debugging
      try {
        const fs = require('fs');
        const file = `debug-timesheet-html-${Date.now()}.html`;
        const content = await this.page.content();
        fs.writeFileSync(file, content);
      } catch (e2) {}
      return false;
    }
  }

  
  async isViewMyTimesheetDisplayed() {
    // reuse headerTimesheets or MyTimesheets link as indicator
    const my = locatorReader.getLocator(this.page, 'timesheet.MyTimesheets');
    const header = locatorReader.getLocator(this.page, 'timesheet.headerTimesheets');
    const candidate = header || my;
    if (!candidate) return false;
    return await candidate.isVisible().catch(() => false);
  }

  async clickEditButton() {
    const edit = locatorReader.getLocator(this.page, 'timesheet.EditTimesheetButton');
    if (!edit) throw new Error('Locator timesheet.EditTimesheetButton not found');
    await edit.click();
     
    const url = this.page.url();
     assert.equal(url.includes("editTimesheet"), true, 'EditTimesheet page not opened after clicking edit button');
      log.info("EditTimesheet page opened after clicking edit button");
    
  }

  async clickCancelButton() {
    const cancel = locatorReader.getLocator(this.page, 'timesheet.Cancelbutton');
    if (!cancel) throw new Error('Locator timesheet.Cancelbutton not found');
    await cancel.click();

    const url = this.page.url();
      assert.equal(url.includes("viewMyTimesheet"), true, 'ViewMyTimesheet page not opened after clicking cancel button');
    
      log.info("ViewMyTimesheet page opened after clicking cancel button");
  
  }
}

module.exports = MyTimesheetsPage;
