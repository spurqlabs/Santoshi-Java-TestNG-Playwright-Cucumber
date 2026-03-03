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
  When User click on Cancel button
  Then My Timesheet page is displayed

@sanity
Scenario: TC003 - Add Contact details
  Given user is on dashbrd page
  When user click on My Info tab
  Then viewPersonalDetails page is displayed with all personal details of the user
  When user click on Contact Details subtab
  Then ContactDetails page is displayed
  When user enter steet1 "<street1>"
  When user enter city "<city>"
  When user enter state "<state>"
  When user enter zip code "<zipcode>"
  When user enter country "<country>"
  When user enter mobile "<mobile>"
  When user enter work phone "<workphone>"
  When user enter work email "<workemail>"
  When user click on Save button
  Then Contact Details is saved successfully

  Examples:
  | street1   | city          | state | zipcode  | country | mobile     | workphone  | workemail       |
  | 45 Street | New York City | MH    | 67899    | Algeria | 9876543210 | 0123456789 | test@xcmail.com |
  | 123 Street| Los Angeles   | CA    | 54321    | Angola  | 7654320912 | 11114455339 | cc@ccmail.com  |
