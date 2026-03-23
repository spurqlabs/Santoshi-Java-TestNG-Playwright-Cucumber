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
  When User click on Timesheet option
  Then Timesheet dropdown list is displayed
  When user select My Timesheets option from the Timesheet dropdown
  Then ViewMyTimesheet page is displayed
  When User click on Edit button
  Then EditTimesheet page is displayed
  When user enter project name
  When user enter activity name
  When user enter time duration
  When user click on Save button
  Then Timesheet details are saved successfully
  
