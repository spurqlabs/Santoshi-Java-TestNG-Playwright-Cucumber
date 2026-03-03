const { timesheet } = require('../locators/locators');
const locatorReader = require('../utils/locatorReader');
const log =  require('../utils/logger');
const assert = require('assert');

class MyInfoPage {
constructor(page) {
    this.page = page;
    }

  async clickonMyInfomenu()
{
 const myInfoMenu = locatorReader.getLocator(this.page, 'myInfo.myInfoMenu');
 await myInfoMenu.click();

 const url = this.page.url();
 assert.equal(url.includes("viewPersonalDetails"), true, 'viewPersonalDetails page not opened after clicking MyInfo menu');
      log.info("viewPersonalDetails page opened after clicking option");

 
}

  async clickContactDetailsTab()
  {
    log.info("Clicking Contact Details tab");
     const contactDetailsTab  = locatorReader.getLocator(this.page, 'contactDetails.tab');
        await contactDetailsTab.click();
       
        const url = this.page.url();
        assert.equal(url.includes("contactDetails"), true, 'ContactDetails page not opened after clicking Contact Details tab');
         log.info("Contact Details tab navigation successful"); 
      }

   async enterstreet1(street1)
   {
    log.info("Entering Street 1 value");
    const street1Field  = locatorReader.getLocator(this.page, 'contactDetails.street1');
    await street1Field.click();
    await street1Field.fill('');
    await street1Field.fill(street1);
    
    assert.equal(await street1Field.inputValue(), street1, 'Street 1 value does not match');
    log.info("Street 1 value entered successfully");

   }

   async enterCity(city)
   {
    log.info("Entering City value");
    const cityField = locatorReader.getLocator(this.page, 'contactDetails.city');
    await cityField.fill(city);
    await this.page.waitForTimeout(500);
   assert.equal(await cityField.inputValue(), city, 'City value does not match');
    log.info("City value entered successfully");
    
   }

   async enterState(state)
   {
    log.info("Entering State value");
    const stateField = locatorReader.getLocator(this.page, 'contactDetails.stateProvince');
    await stateField.fill(state);
    
    assert.equal(await stateField.inputValue(), state, 'State value does not match');
     log.info("State value entered successfully");
   }

   async enterzipcode(zipcode)
   {
    log.info("Entering Zipcode value");
    const zipcodeField = locatorReader.getLocator(this.page, 'contactDetails.zipPostalCode');
    await zipcodeField.fill(zipcode);
    
    assert.equal(await zipcodeField.inputValue(), zipcode, 'Zipcode value does not match');
    log.info("Zipcode value entered successfully");
   }

   async selectcountry(country)
   {
    log.info("Selecting Country value");
    const countryDropdown = locatorReader.getLocator(this.page, 'contactDetails.country');
    await countryDropdown.click();
    await this.page.getByText(country).click();
   
    assert.equal(await countryDropdown.textContent(), country, 'Country value does not match');
     log.info("Country value selected successfully");

   }

    async entermobile(mobile)
    {
        log.info("Entering Mobile number value");
        const mobileField = locatorReader.getLocator(this.page, 'contactDetails.mobile');
        await mobileField.fill(mobile);
        
        assert.equal(await mobileField.inputValue(), mobile, 'Mobile number value does not match');
        log.info("Mobile number value entered successfully");
     }
      
     async enterworkmobile(workphone)
        {
            log.info("Entering Work Mobile number value");
            const workmobileField = locatorReader.getLocator(this.page, 'contactDetails.work');
            await workmobileField.fill(workphone);
            
            await this.page.mouse.wheel(0, 1000);
            assert.equal(await workmobileField.inputValue(), workphone, 'Work Mobile number value does not match');
                log.info("Work Mobile number value entered successfully");
         }


        async enterworkemail(workemail)
        {
            log.info("Entering Work Email value");
            const workemailField = locatorReader.getLocator(this.page, 'contactDetails.workEmail');
            await workemailField.fill(workemail);
            
            assert.equal(await workemailField.inputValue(), workemail, 'Work Email value does not match');
            log.info("Work Email value entered successfully");
          }

          async clicksavebutton()
          {
            log.info("Clicking Save button");
            const saveButton = locatorReader.getLocator(this.page, 'contactDetails.saveButton');
            await saveButton.click();
            
            assert.equal(await saveButton.isVisible(), true, 'Contact Details not saved after clicking Save button');
           log.info("Save button clicked successfully");
          }




        }











        
     





    



module.exports = MyInfoPage;

