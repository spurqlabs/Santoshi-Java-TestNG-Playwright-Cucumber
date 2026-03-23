const BasePage = require('./BasePage');
const locatorReader = require('../utils/locatorReader');
const Logger = require('../utils/logger');
const assert = require('assert');
const path = require('path');

/**
 * View Candidate Page Object Model
 * Handles viewing candidate details, downloading resume, shortlisting, scheduling interview, and logout
 * Uses locators from recruit_locators.json and testdata from ScenarioContext
 */
class ViewCandidatePage extends BasePage {
  constructor(page, scenarioContext = null) {
    super(page);
    
    // Load locators from locatorReader
    this.viewCandidatesLocators = locatorReader.getViewCandidatesPageLocators();
    this.addCandidateLocators = locatorReader.getAddCandidatePageLocators();
    this.applicationStageLocators = locatorReader.getApplicationStagePageLocators();
    this.shortlistLocators = locatorReader.getShortlistCandidatePageLocators();
    this.scheduleInterviewLocators = locatorReader.getScheduleInterviewPageLocators();
    this.profileMenuLocators = locatorReader.getProfileMenuLocators();
    this.recruitmentMenuLocator = locatorReader.getRecruitmentMenuLocator();
    this.commonLocators = locatorReader.getCommonLocatorsRecruitment();
    
    // Download directory for resume
    this.downloadDir = path.join(process.cwd(), 'downloads');
    // Store scenario context for data access
    this.scenarioContext = scenarioContext;
  }

  /**
   * Set scenario context
   * @param {object} scenarioContext - Scenario context object
   */
  setScenarioContext(scenarioContext) {
    this.scenarioContext = scenarioContext;
  }

  /**
   * Helper method to get selector string from locator (handles both string and object formats)
   * @param {string|object} locator - Locator string or object with selector property
   * @returns {string} - Selector string
   */
  getSelector(locator) {
    return typeof locator === 'string' ? locator : locator?.selector;
  }

  // ==================== NAVIGATION METHODS ====================

  /**
   * Navigate to View Candidates page from dashboard
   */
  async navigateToViewCandidatesPage() {
    Logger.step('Navigating to View Candidates page');
    const selector = this.getSelector(this.recruitmentMenuLocator);
    await this.getLocator(selector).click();
    await this.waitForElement(this.getSelector(this.viewCandidatesLocators.candidatesHeading));
    Logger.info('Successfully navigated to View Candidates page');
  }

  /**
   * Search for a candidate by name
   * @param {string} candidateName - Name of the candidate to search
   */
  async searchCandidate(candidateName) {
    Logger.step(`Searching for candidate: ${candidateName}`);
    
    // Enter candidate name in search input
    const nameInputSelector = this.getSelector(this.viewCandidatesLocators.candidateNameInput);
    await this.getLocator(nameInputSelector).fill(candidateName);
    
    // Click search button
    const searchButtonSelector = this.getSelector(this.viewCandidatesLocators.searchButton);
    await this.getLocator(searchButtonSelector).click();
    
    // Wait for results to load
    await this.page.waitForTimeout(2000);
    
    Logger.info(`Search completed for: ${candidateName}`);
  }

  /**
   * Click View button for a specific candidate
   * @param {string} candidateName - Name of the candidate to view
   */
  async clickViewCandidateButton(candidateName) {
    Logger.step(`Clicking View button for candidate: ${candidateName}`);
    
    // Search for the candidate first
    await this.searchCandidate(candidateName);
    
    // Wait for table to load
    await this.waitForElement(this.getSelector(this.viewCandidatesLocators.candidatesTable));
    
    // Find the row containing the candidate name and click the view button
    const tableSelector = this.getSelector(this.viewCandidatesLocators.candidatesTable);
    const viewButtonSelector = this.getSelector(this.viewCandidatesLocators.viewCandidateButton);
    
    // Find row with candidate name and click the view button in that row
    const row = this.page.locator(`${tableSelector} .oxd-table-row`).filter({ 
      has: this.page.locator(`text="${candidateName}"`) 
    });
    
    await row.locator(viewButtonSelector).click();
    
    // Wait for Application Stage page to load
    await this.waitForElement(this.getSelector(this.applicationStageLocators.applicationStageHeading));
    
    Logger.info(`View button clicked for: ${candidateName}`);
  }

  /**
   * Verify candidate details are displayed correctly
   * @param {object} candidateData - Expected candidate data
   */
  async verifyCandidateDetails(candidateData) {
    Logger.step('Verifying candidate details');
    
    // Wait for Application Stage page to load
    await this.waitForElement(this.getSelector(this.applicationStageLocators.candidateProfileHeading));
    
    // Verify candidate name is displayed
    const candidateNameElement = this.getLocator(this.getSelector(this.applicationStageLocators.candidateNameLabel));
    const displayedName = await candidateNameElement.textContent();
    const expectedFullName = `${candidateData.firstname} ${candidateData.lastname}`;
    assert.ok(
      displayedName.includes(expectedFullName),
      `Candidate name should be "${expectedFullName}", but found "${displayedName}"`
    );
    Logger.info(`Candidate name verified: ${displayedName}`);
    
    // Verify vacancy is displayed
    const vacancyElement = this.getLocator(this.getSelector(this.applicationStageLocators.vacancyLabel));
    const displayedVacancy = await vacancyElement.textContent();
    assert.ok(
      displayedVacancy.includes(candidateData.jobvacancy),
      `Vacancy should be "${candidateData.jobvacancy}", but found "${displayedVacancy}"`
    );
    Logger.info(`Vacancy verified: ${displayedVacancy}`);
    
    Logger.info('All candidate details verified successfully');
  }

  // ==================== RESUME DOWNLOAD METHODS ====================

  /**
   * Click on Download Resume button
   */
  async clickDownloadResumeButton() {
    Logger.step('Clicking Download Resume button');
    
    const selector = this.getSelector(this.applicationStageLocators.downloadResumeButton);
    await this.waitForElement(selector);
    
    // Start waiting for download before clicking
    const [download] = await Promise.all([
      this.page.waitForEvent('download'),
      this.getLocator(selector).click()
    ]);
    
    // Save download reference for verification
    this.lastDownload = download;
    
    Logger.info('Download Resume button clicked');
    return download;
  }

  /**
   * Verify resume is downloaded successfully
   * @returns {boolean} - True if download successful
   */
  async verifyResumeDownloaded() {
    Logger.step('Verifying resume download');
    
    if (!this.lastDownload) {
      throw new Error('No download initiated. Call clickDownloadResumeButton first.');
    }
    
    // Wait for download to complete
    const downloadPath = await this.lastDownload.path();
    const fileName = this.lastDownload.suggestedFilename();
    
    assert.ok(downloadPath, 'Download path should exist');
    assert.ok(fileName, 'Downloaded file should have a filename');
    
    Logger.info(`Resume downloaded successfully: ${fileName}`);
    Logger.info(`Download path: ${downloadPath}`);
    
    return true;
  }

  // ==================== SHORTLIST METHODS ====================

  /**
   * Click on Shortlist button
   */
  async clickShortlistButton() {
    Logger.step('Clicking Shortlist button');
    
    const selector = this.getSelector(this.applicationStageLocators.shortlistButton);
    await this.waitForElement(selector);
    await this.getLocator(selector).click();
    
    Logger.info('Shortlist button clicked');
  }

  /**
   * Verify navigation to Shortlist Candidate page
   */
  async verifyShortlistCandidatePageDisplayed() {
    Logger.step('Verifying Shortlist Candidate page is displayed');
    
    const selector = this.getSelector(this.shortlistLocators.shortlistCandidateHeading);
    await this.waitForElement(selector);
    
    const isVisible = await this.getLocator(selector).isVisible();
    assert.equal(isVisible, true, 'Shortlist Candidate page should be displayed');
    
    Logger.info('Shortlist Candidate page displayed successfully');
  }

  /**
   * Enter notes in Shortlist page
   * @param {string} notes - Notes to enter (optional, uses scenarioContext if not provided)
   */
  async enterShortlistNotes(notes) {
    // If notes not provided, get from scenarioContext
    if (!notes && this.scenarioContext) {
      notes = this.scenarioContext.getData('Notes');
    }
    Logger.step(`Entering shortlist notes: ${notes}`);
    
    const selector = this.getSelector(this.shortlistLocators.notesInput);
    await this.waitForElement(selector);
    await this.getLocator(selector).fill(notes);
    
    Logger.info('Shortlist notes entered successfully');
  }

  /**
   * Click Save button on Shortlist page
   */
  async clickShortlistSaveButton() {
    Logger.step('Clicking Save button on Shortlist page');
    
    const selector = this.getSelector(this.shortlistLocators.saveButton);
    await this.waitForElement(selector);
    await this.getLocator(selector).click();
    
    // Wait for page to navigate
    await this.page.waitForTimeout(2000);
    
    Logger.info('Save button clicked on Shortlist page');
  }

  /**
   * Complete shortlist flow with notes
   * @param {string} notes - Notes to enter
   */
  async completeShortlistFlow(notes) {
    Logger.step('Completing shortlist flow');
    
    await this.clickShortlistButton();
    await this.verifyShortlistCandidatePageDisplayed();
    await this.enterShortlistNotes(notes);
    await this.clickShortlistSaveButton();
    
    Logger.info('Shortlist flow completed');
  }

  // ==================== SCHEDULE INTERVIEW METHODS ====================

  /**
   * Click on Schedule Interview button
   */
  async clickScheduleInterviewButton() {
    Logger.step('Clicking Schedule Interview button');
    
    const selector = this.getSelector(this.applicationStageLocators.scheduleInterviewButton);
    await this.waitForElement(selector);
    await this.getLocator(selector).click();
    
    Logger.info('Schedule Interview button clicked');
  }

  /**
   * Verify navigation to Schedule Interview page
   */
  async verifyScheduleInterviewPageDisplayed() {
    Logger.step('Verifying Schedule Interview page is displayed');
    
    const selector = this.getSelector(this.scheduleInterviewLocators.scheduleInterviewHeading);
    await this.waitForElement(selector);
    
    const isVisible = await this.getLocator(selector).isVisible();
    assert.equal(isVisible, true, 'Schedule Interview page should be displayed');
    
    Logger.info('Schedule Interview page displayed successfully');
  }

  /**
   * Enter Interview Title
   * @param {string} title - Interview title
   */
  async enterInterviewTitle(title) {
    Logger.step(`Entering Interview Title: ${title}`);
    
    try {
      // Approach 1: Find the grid item that contains "Interview Title" label, then find the input inside
      const interviewTitleInput = this.page.locator('.oxd-grid-item').filter({ 
        has: this.page.locator('.oxd-label', { hasText: 'Interview Title' }) 
      }).locator('.oxd-input');
      
      await interviewTitleInput.waitFor({ state: 'visible', timeout: 10000 });
      await interviewTitleInput.fill(title);
      Logger.info('Interview Title entered successfully using label filter');
    } catch (e) {
      // Fallback: try using the original selector
      Logger.info(`Primary selector failed: ${e.message}, trying fallback selector`);
      const selector = this.getSelector(this.scheduleInterviewLocators.interviewTitleInput);
      await this.waitForElement(selector);
      await this.getLocator(selector).fill(title);
      Logger.info('Interview Title entered successfully using fallback selector');
    }
  }

  /**
   * Enter Interviewer name
   * @param {string} interviewer - Interviewer name
   */
  async enterInterviewer(interviewer) {
    Logger.step(`Entering Interviewer: ${interviewer}`);
    
    const selector = this.getSelector(this.scheduleInterviewLocators.interviewerInput);
    await this.waitForElement(selector);
    await this.getLocator(selector).fill(interviewer);
    
    // Wait for autocomplete suggestions
    await this.page.waitForTimeout(1000);
    
    // Select the matching option from dropdown
    const optionSelector = this.getSelector(this.commonLocators.dropdownOption);
    await this.getLocator(optionSelector).filter({ hasText: interviewer }).first().click();
    
    Logger.info('Interviewer entered and selected successfully');
  }

  /**
   * Enter Interview Date
   * @param {string} date - Interview date (format: YYYY-DD-MM)
   */
  async enterInterviewDate(date) {
    Logger.step(`Entering Interview Date: ${date}`);
    
    try {
      // Approach 1: Find the input with placeholder "yyyy-dd-mm" which is the date input
      const dateInput = this.page.getByRole('textbox', { name: 'yyyy-dd-mm' });
      
      await dateInput.waitFor({ state: 'visible', timeout: 10000 });
      await dateInput.fill(date);
      Logger.info('Interview Date entered successfully using role selector');
    } catch (e) {
      Logger.info(`Primary selector failed: ${e.message}, trying fallback selector`);
      
      try {
        // Approach 2: Find the grid item that contains "Interview Date" or just "Date" label (excluding readonly inputs)
        const dateGridItem = this.page.locator('.oxd-grid-item').filter({ 
          has: this.page.locator('.oxd-label', { hasText: 'Date' }) 
        });
        
        // Find the editable input (not readonly) within the Date grid item
        const editableDateInput = dateGridItem.locator('.oxd-input:not([readonly])');
        await editableDateInput.waitFor({ state: 'visible', timeout: 10000 });
        await editableDateInput.fill(date);
        Logger.info('Interview Date entered successfully using label filter');
      } catch (e2) {
        // Fallback: try using the original selector
        Logger.info(`Secondary selector failed: ${e2.message}, trying nth-child selector`);
        const selector = this.getSelector(this.scheduleInterviewLocators.dateInput);
        await this.waitForElement(selector);
        await this.getLocator(selector).fill(date);
        Logger.info('Interview Date entered successfully using fallback selector');
      }
    }
  }

 
      
     
      
      
          
         
      
      
       
            
      
      
  

  
    
    
        
        
    
      
      

  

  /**
   * Enter Interview Notes
   * @param {string} notes - Interview notes
   */
  async enterInterviewNotes(notes) {
    Logger.step(`Entering Interview Notes: ${notes}`);
    
    try {
      // Approach 1: Find the textbox with "Type here" placeholder
      const notesInput = this.page.getByRole('textbox', { name: 'Type here' });
      
      await notesInput.waitFor({ state: 'visible', timeout: 10000 });
      await notesInput.fill(notes);
      Logger.info('Interview Notes entered successfully using role selector');
    } catch (e) {
      Logger.info(`Primary selector failed: ${e.message}, trying fallback selector`);
      
      try {
        // Approach 2: Find the grid item that contains "Notes" label
        const notesGridItem = this.page.locator('.oxd-grid-item').filter({ 
          has: this.page.locator('.oxd-label', { hasText: 'Notes' }) 
        });
        
        const notesTextarea = notesGridItem.locator('textarea');
        await notesTextarea.waitFor({ state: 'visible', timeout: 10000 });
        await notesTextarea.fill(notes);
        Logger.info('Interview Notes entered successfully using label filter');
      } catch (e2) {
        // Fallback: try using the selector from locators
        Logger.info(`Secondary selector failed: ${e2.message}, trying locator from config`);
        const selector = this.getSelector(this.scheduleInterviewLocators.notesInput);
        await this.waitForElement(selector);
        await this.getLocator(selector).fill(notes);
        Logger.info('Interview Notes entered successfully using fallback selector');
      }
    }
  }

  /**
   * Click Save button on Schedule Interview page
   */
  async clickScheduleInterviewSaveButton() {
    Logger.step('Clicking Save button on Schedule Interview page');
    
    // Wait for the form loader to disappear (it intercepts pointer events)
    const loaderSelector = '.oxd-form-loader';
    try {
      await this.page.locator(loaderSelector).waitFor({ state: 'hidden', timeout: 10000 });
      Logger.info('Form loader disappeared');
    } catch (e) {
      Logger.info('Form loader not found or already hidden');
    }
    
    // Wait for any spinner/loading indicator to disappear
    const spinnerSelector = '.oxd-loading-spinner';
    try {
      await this.page.locator(spinnerSelector).waitFor({ state: 'hidden', timeout: 10000 });
      Logger.info('Loading spinner disappeared');
    } catch (e) {
      Logger.info('Loading spinner not found or already hidden');
    }
    
    // Wait a bit for the page to be fully interactive
    await this.page.waitForTimeout(1000);
    
    // Check for any validation errors before clicking save
    const errorMessages = this.page.locator('.oxd-input-field-error-message');
    const errorCount = await errorMessages.count();
    if (errorCount > 0) {
      Logger.warn(`Found ${errorCount} validation errors on the form before clicking Save`);
      for (let i = 0; i < errorCount; i++) {
        const errorText = await errorMessages.nth(i).textContent();
        Logger.warn(`Validation error ${i + 1}: ${errorText}`);
      }
    }
    
    // Scroll to the bottom of the form to ensure buttons are visible
    await this.page.evaluate(() => {
      window.scrollTo(0, document.body.scrollHeight);
    }).catch(() => {});
    await this.page.waitForTimeout(500);
    
    // Try multiple selectors for the Save button
    let saveButton = null;
    const saveButtonSelectors = [
      () => this.page.getByRole('button', { name: 'Save' }),
      () => this.page.locator('.oxd-form-actions button.oxd-button--secondary').last(),
      () => this.page.locator('.oxd-form-actions .oxd-button--secondary').last(),
      () => this.page.locator('button.oxd-button--secondary').filter({ hasText: 'Save' }).last(),
      () => this.page.locator('.oxd-button--secondary').filter({ hasText: 'Save' }).last(),
      () => this.page.locator('button[type="submit"]').filter({ hasText: 'Save' }),
      () => this.page.locator('.oxd-form button[type="submit"]').last(),
      () => this.page.locator('button:has-text("Save")').last()
    ];
    
    for (let i = 0; i < saveButtonSelectors.length; i++) {
      try {
        const btn = saveButtonSelectors[i]();
        const count = await btn.count().catch(() => 0);
        if (count > 0) {
          const buttonToUse = count > 1 ? btn.last() : btn;
          const isVisible = await buttonToUse.isVisible({ timeout: 3000 }).catch(() => false);
          if (isVisible) {
            saveButton = buttonToUse;
            Logger.info(`Save button found using selector ${i + 1}`);
            break;
          }
        }
      } catch (e) {
        Logger.info(`Selector ${i + 1} failed: ${e.message}`);
      }
    }
    
    if (!saveButton) {
      // Last resort: find any button that contains "Save" text
      Logger.warn('Save button not found with specific selectors, trying text-based search');
      const allButtons = this.page.locator('button');
      const buttonCount = await allButtons.count();
      Logger.info(`Found ${buttonCount} buttons on the page`);
      
      for (let i = 0; i < buttonCount; i++) {
        const btn = allButtons.nth(i);
        const text = await btn.textContent().catch(() => '');
        if (text && text.trim().toLowerCase() === 'save') {
          saveButton = btn;
          Logger.info(`Found Save button at index ${i}`);
          break;
        }
      }
      
      if (!saveButton) {
        // Final fallback: get the last secondary button
        saveButton = this.page.locator('.oxd-button--secondary').last();
      }
    }
    
    // Wait for button to be visible and try to click
    try {
      await saveButton.waitFor({ state: 'attached', timeout: 10000 });
      Logger.info('Save button is attached to DOM');
      
      // Scroll into view
      await saveButton.scrollIntoViewIfNeeded();
      await this.page.waitForTimeout(500);
      
      // Check if visible
      const isVisible = await saveButton.isVisible().catch(() => false);
      if (!isVisible) {
        Logger.warn('Save button is not visible, trying to make it visible');
        // Try to scroll the form container
        await this.page.evaluate(() => {
          const formActions = document.querySelector('.oxd-form-actions');
          if (formActions) {
            formActions.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        }).catch(() => {});
        await this.page.waitForTimeout(500);
      }
    } catch (e) {
      Logger.error(`Save button not found: ${e.message}`);
      // Take a screenshot for debugging
      await this.page.screenshot({ path: 'reports/screenshots/save-button-not-visible.png' }).catch(() => {});
      
      // Log all buttons on the page for debugging
      const allButtons = await this.page.locator('button').allTextContents();
      Logger.info(`All buttons on page: ${allButtons.join(', ')}`);
      
      throw new Error('Save button is not visible on Schedule Interview page');
    }
    
    // Ensure button is enabled
    const isEnabled = await saveButton.isEnabled().catch(() => false);
    if (!isEnabled) {
      Logger.warn('Save button is disabled, waiting for it to be enabled');
      try {
        await saveButton.waitFor({ state: 'enabled', timeout: 10000 });
      } catch (e) {
        Logger.error('Save button remained disabled');
        // Check for validation errors
        const errors = await this.page.locator('.oxd-input-field-error-message').allTextContents();
        Logger.error(`Form validation errors: ${errors.join(', ')}`);
        throw new Error(`Save button is disabled. Validation errors: ${errors.join(', ')}`);
      }
    }
    
    // Try clicking with multiple approaches
    try {
      await saveButton.click({ timeout: 10000 });
      Logger.info('Save button clicked successfully');
    } catch (e) {
      Logger.info(`Regular click failed: ${e.message}, trying force click`);
      try {
        await saveButton.click({ force: true });
        Logger.info('Force click executed');
      } catch (e2) {
        Logger.error(`Force click also failed: ${e2.message}`);
        // Try using keyboard Enter
        await saveButton.focus();
        await this.page.keyboard.press('Enter');
        Logger.info('Used keyboard Enter to click Save button');
      }
    }
    
    // Wait for navigation/response
    await this.page.waitForTimeout(3000);
    
    Logger.info('Save button clicked on Schedule Interview page');
  }

  /**
   * Complete schedule interview flow
   * @param {object} scenarioContext - Scenario context with getData method
   * @param {object} interviewData - Optional interview data object (overrides scenarioContext)
   */
  async completeScheduleInterviewFlow(scenarioContext, interviewData = {}) {
    Logger.step('Completing schedule interview flow');
    
    await this.clickScheduleInterviewButton();
    await this.verifyScheduleInterviewPageDisplayed();
    
    // Enter interview details using unified getData method
    const interviewTitle = interviewData.interviewTitle || scenarioContext?.getData?.('Interview Title');
    const interviewer = interviewData.interviewer || scenarioContext?.getData?.('Interviewer');
    const interviewDate = interviewData.interviewDate || scenarioContext?.getData?.('Interview Date');
    const notes = interviewData.notes || scenarioContext?.getData?.('Note');
    
    await this.enterInterviewTitle(interviewTitle);
    await this.enterInterviewer(interviewer);
    await this.enterInterviewDate(interviewDate);
    
    if (notes) {
      await this.enterInterviewNotes(notes);
    }
    
    await this.clickScheduleInterviewSaveButton();
    
    Logger.info('Schedule interview flow completed');
  }

  /**
   * Enter interview schedule details and click Save button
   * This method extracts data from scenarioContext using unified getData method
   * @param {object} scenarioContext - Scenario context object with getData method (optional, uses internal scenarioContext if not provided)
   */
  async enterInterviewScheduleDetailsAndSave(scenarioContext) {
    Logger.step('Entering interview schedule details and saving');
    
    // Use provided scenarioContext or internal one
    const ctx = scenarioContext || this.scenarioContext;
    
    // Build interview data object from scenario context using unified getData method
    const interviewTitle = ctx?.getData?.('Interview Title') || 'Technical Interview';
    const interviewer = ctx?.getData?.('Interviewer') || 'Lisa Andrews';
    const interviewDate = ctx?.getData?.('Interview Date') || '2026-03-20';
    const notes = ctx?.getData?.('Note') || 'First round of technical interview';
    
    // Enter interview title
    await this.enterInterviewTitle(interviewTitle);
    
    // Enter interviewer
    await this.enterInterviewer(interviewer);
    
    // Enter interview date
    await this.enterInterviewDate(interviewDate);
    
    // Enter notes if available
    if (notes) {
      await this.enterInterviewNotes(notes);
    }
    
    // Click save button
    await this.clickScheduleInterviewSaveButton();
    
    Logger.info('Interview schedule details entered and saved successfully');
  }

  /**
   * Verify Application Stage page is displayed with Interview Scheduled status
   */
  async verifyApplicationStageWithInterviewStatus() {
    Logger.step('Verifying Application Stage page with Interview Scheduled status');
    
    // First check if there are any validation errors on the page
    const errorMessages = this.page.locator('.oxd-input-field-error-message');
    const errorCount = await errorMessages.count();
    if (errorCount > 0) {
      Logger.warn(`Found ${errorCount} validation errors on the form`);
      for (let i = 0; i < errorCount; i++) {
        const errorText = await errorMessages.nth(i).textContent();
        Logger.warn(`Validation error ${i + 1}: ${errorText}`);
      }
      throw new Error(`Form has ${errorCount} validation errors. Please check the interview details.`);
    }
    
    // Check for error toast
    const errorToast = this.page.locator('.oxd-toast--error');
    const isErrorToastVisible = await errorToast.isVisible().catch(() => false);
    if (isErrorToastVisible) {
      const toastText = await errorToast.textContent();
      Logger.error(`Error toast displayed: ${toastText}`);
      throw new Error(`Form submission failed with error: ${toastText}`);
    }
    
    // Wait for Application Stage page with retry
    const selector = this.getSelector(this.applicationStageLocators.applicationStageHeading);
    let isNavigated = false;
    
    for (let attempt = 0; attempt < 3; attempt++) {
      try {
        await this.getLocator(selector).waitFor({ state: 'visible', timeout: 10000 });
        isNavigated = true;
        break;
      } catch (e) {
        Logger.info(`Attempt ${attempt + 1} to verify Application Stage page failed`);
        
        // Check if we're still on the Schedule Interview page
        const stillOnSchedulePage = await this.page.locator('.oxd-text--subtitle').filter({ hasText: 'Schedule Interview' }).isVisible().catch(() => false);
        if (stillOnSchedulePage) {
          Logger.warn('Still on Schedule Interview page - possible validation error');
          
          // Try clicking Save button again
          const saveButton = this.page.locator('.oxd-form-actions .oxd-button--secondary').last();
          if (await saveButton.isVisible()) {
            await saveButton.click();
            await this.page.waitForTimeout(2000);
          }
        }
      }
    }
    
    if (!isNavigated) {
      throw new Error('Failed to navigate to Application Stage page after clicking Save');
    }
    
    // Verify status shows "Interview Scheduled"
    const statusElement = this.getLocator(this.getSelector(this.applicationStageLocators.statusLabel));
    const statusText = await statusElement.textContent();
    
    assert.ok(
      statusText.toLowerCase().includes('interview'),
      `Status should contain "Interview", but found "${statusText}"`
    );
    
    Logger.info(`Application Stage page verified with status: ${statusText}`);
  }

  // ==================== LOGOUT METHODS ====================

  /**
   * Click on Profile dropdown menu
   */
  async clickProfileDropdown() {
    Logger.step('Clicking Profile dropdown');
    
    const selector = this.getSelector(this.profileMenuLocators.profileDropdown);
    await this.waitForElement(selector);
    await this.getLocator(selector).click();
    
    // Wait for dropdown menu to appear
    await this.page.waitForTimeout(500);
    
    Logger.info('Profile dropdown clicked');
  }

  /**
   * Click on Logout menu item
   */
  async clickLogoutMenuItem() {
    Logger.step('Clicking Logout menu item');
    
    const selector = this.getSelector(this.profileMenuLocators.logoutLink);
    await this.waitForElement(selector);
    await this.getLocator(selector).click();
    
    Logger.info('Logout menu item clicked');
  }

  /**
   * Perform logout from application
   */
  async performLogout() {
    Logger.step('Performing logout');
    
    await this.clickProfileDropdown();
    await this.clickLogoutMenuItem();
    
    Logger.info('Logout completed');
  }

  /**
   * Verify user is logged out
   */
  async verifyLoggedOut() {
    Logger.step('Verifying user is logged out');
    
    // Wait for login page to appear
    await this.page.waitForURL('**/login**', { timeout: this.timeout });
    
    const currentUrl = this.page.url();
    assert.ok(
      currentUrl.includes('login'),
      'URL should contain "login" after logout'
    );
    
    Logger.info('User successfully logged out');
  }

  // ==================== COMPOSITE METHODS FOR SCENARIO FLOW ====================

  /**
   * View and verify candidate details
   * @param {object} candidateData - Candidate data to verify
   */
  async viewAndVerifyCandidate(candidateData) {
    Logger.step('Viewing and verifying candidate details');
    
    // Search for candidate
    const fullName = `${candidateData.firstname} ${candidateData.lastname}`;
    await this.searchCandidate(fullName);
    
    // Click view button
    await this.clickViewCandidateButton(fullName);
    
    // Verify details
    await this.verifyCandidateDetails(candidateData);
    
    Logger.info('View and verify candidate completed');
  }

  /**
   * Download resume and verify
   */
  async downloadAndVerifyResume() {
    Logger.step('Downloading and verifying resume');
    
    await this.clickDownloadResumeButton();
    await this.verifyResumeDownloaded();
    
    Logger.info('Download and verify resume completed');
  }

  /**
   * Shortlist candidate with notes from scenarioContext
   * @param {object} scenarioContext - Scenario context with getData method
   */
  async shortlistCandidate(scenarioContext) {
    Logger.step('Shortlisting candidate');
    
    const notes = scenarioContext?.getData?.('Notes');
    await this.completeShortlistFlow(notes);
    
    Logger.info('Candidate shortlisted');
  }

  /**
   * Schedule interview with details from scenarioContext
   * @param {object} scenarioContext - Scenario context with getData method
   */
  async scheduleInterview(scenarioContext) {
    Logger.step('Scheduling interview');
    
    await this.completeScheduleInterviewFlow(scenarioContext);
    
    Logger.info('Interview scheduled');
  }

  /**
   * Complete TC004 flow - View Candidate, Download Resume, Shortlist, Schedule Interview, Logout
   * @param {object} scenarioContext - Scenario context with getData method
   * @param {object} candidateData - Candidate data from TC003
   */
  async completeViewCandidateFlow(scenarioContext, candidateData) {
    Logger.info('Starting complete view candidate flow (TC004)');
    
    // Navigate to recruitment page
    await this.navigateToViewCandidatesPage();
    
    // View and verify candidate
    await this.viewAndVerifyCandidate(candidateData);
    
    // Download resume
    await this.downloadAndVerifyResume();
    
    // Shortlist candidate
    await this.shortlistCandidate(scenarioContext);
    
    // Schedule interview
    await this.scheduleInterview(scenarioContext);
    
    // Verify interview scheduled status
    await this.verifyApplicationStageWithInterviewStatus();
    
    // Logout
    await this.performLogout();
    await this.verifyLoggedOut();
    
    Logger.info('Complete view candidate flow finished');
  }

  // ==================== PAGE STATE CHECK METHODS ====================

  /**
   * Check if View Candidates page is displayed
   * @returns {boolean}
   */
  async isViewCandidatesPageDisplayed() {
    try {
      const selector = this.getSelector(this.viewCandidatesLocators.candidatesHeading);
      await this.getLocator(selector).waitFor({ state: 'visible', timeout: 10000 });
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Check if Application Stage page is displayed
   * @returns {boolean}
   */
  async isApplicationStagePageDisplayed() {
    try {
      const selector = this.getSelector(this.applicationStageLocators.applicationStageHeading);
      await this.getLocator(selector).waitFor({ state: 'visible', timeout: 10000 });
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Check if Schedule Interview page is displayed
   * @returns {boolean}
   */
  async isScheduleInterviewPageDisplayed() {
    try {
      const selector = this.getSelector(this.scheduleInterviewLocators.scheduleInterviewHeading);
      await this.getLocator(selector).waitFor({ state: 'visible', timeout: 10000 });
      return true;
    } catch {
      return false;
    }
  }

  // ==================== ASSERTION METHODS ====================

  /**
   * Assert View Candidates page is displayed
   */
  async assertViewCandidatesPageDisplayed() {
    Logger.assertion('Asserting View Candidates page is displayed');
    const selector = this.getSelector(this.viewCandidatesLocators.candidatesHeading);
    await this.getLocator(selector).waitFor({ state: 'visible', timeout: this.timeout });
    const isVisible = await this.getLocator(selector).isVisible();
    assert.equal(isVisible, true, 'View Candidates page should be displayed');
    Logger.info('Assertion passed: View Candidates page is displayed');
  }

  /**
   * Assert Application Stage page is displayed
   */
  async assertApplicationStagePageDisplayed() {
    Logger.assertion('Asserting Application Stage page is displayed');
    const selector = this.getSelector(this.applicationStageLocators.applicationStageHeading);
    await this.getLocator(selector).waitFor({ state: 'visible', timeout: this.timeout });
    const isVisible = await this.getLocator(selector).isVisible();
    assert.equal(isVisible, true, 'Application Stage page should be displayed');
    Logger.info('Assertion passed: Application Stage page is displayed');
  }

  /**
   * Assert Shortlist Candidate page is displayed
   */
  async assertShortlistCandidatePageDisplayed() {
    Logger.assertion('Asserting Shortlist Candidate page is displayed');
    const selector = this.getSelector(this.shortlistLocators.shortlistCandidateHeading);
    await this.getLocator(selector).waitFor({ state: 'visible', timeout: this.timeout });
    const isVisible = await this.getLocator(selector).isVisible();
    assert.equal(isVisible, true, 'Shortlist Candidate page should be displayed');
    Logger.info('Assertion passed: Shortlist Candidate page is displayed');
  }

  /**
   * Assert Schedule Interview page is displayed
   */
  async assertScheduleInterviewPageDisplayed() {
    Logger.assertion('Asserting Schedule Interview page is displayed');
    const selector = this.getSelector(this.scheduleInterviewLocators.scheduleInterviewHeading);
    await this.getLocator(selector).waitFor({ state: 'visible', timeout: this.timeout });
    const isVisible = await this.getLocator(selector).isVisible();
    assert.equal(isVisible, true, 'Schedule Interview page should be displayed');
    Logger.info('Assertion passed: Schedule Interview page is displayed');
  }

  /**
   * Assert candidate details are correct
   * @param {object} expectedData - Expected candidate data
   */
  async assertCandidateDetailsCorrect(expectedData) {
    Logger.assertion('Asserting candidate details are correct');
    await this.verifyCandidateDetails(expectedData);
    Logger.info('Assertion passed: Candidate details are correct');
  }

  /**
   * Assert resume is downloaded
   */
  async assertResumeDownloaded() {
    Logger.assertion('Asserting resume is downloaded');
    const isDownloaded = await this.verifyResumeDownloaded();
    assert.equal(isDownloaded, true, 'Resume should be downloaded');
    Logger.info('Assertion passed: Resume is downloaded');
  }

  /**
   * Assert user is logged out
   */
  async assertUserLoggedOut() {
    Logger.assertion('Asserting user is logged out');
    await this.verifyLoggedOut();
    Logger.info('Assertion passed: User is logged out');
  }

  /**
   * Assert success toast is displayed
   */
  async assertSuccessToastDisplayed() {
    Logger.assertion('Asserting success toast is displayed');
    const selector = this.getSelector(this.commonLocators.successToast);
    await this.getLocator(selector).waitFor({ state: 'visible', timeout: this.timeout });
    const isVisible = await this.getLocator(selector).isVisible();
    assert.equal(isVisible, true, 'Success toast should be displayed');
    Logger.info('Assertion passed: Success toast is displayed');
  }
}

module.exports = ViewCandidatePage;
