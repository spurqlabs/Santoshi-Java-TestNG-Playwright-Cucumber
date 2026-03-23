Feature: Recruitment Management in OrangeHRM

Background:
  Given user is on OrangeHRM login page
  When user enter username
  When user enter password
  When user click on Login button
  Then the user is logged in to the application

@smoke1
Scenario: TC003 - Add Candidate details
Given user is on dashboard page
When user click on Recruitment menu
Then user navigate to viewCandidates page
When user click on Add button
Then user navigate to addCandidate page
When user enter First Name
When user enter Last Name
When user select Job Vacancy
When user enter Email
When user enter Contact Number
When user upload Resume
When user click on Savebutton
Then the candidate details is added successfully

@regression1
Scenario: TC004 - View Candidate details, downloaded attached resume and schedule Interview
Given user is on home page
When user click on Recruit_menu 
Then user navigate to recruitment page
When user added a new candidate
Then candidate is created sucessfully
When user click on download button for resume
Then the resume is downloaded successfully
When user click on Shortlist button
Then user navigate to changeCandidateVacancyStatus page
When user enter Notes and click save_BTN
Then entered details are saved and navigate to addCandidate page
When user click on Schedule Interview button
Then user navigate to Schedule Interview page for the entered interview details
When user enter interview schedule details and click_SAVE
Then entered interview details are saved and navigate to Applcation stage page with Interview Scheduled status
When user click on Logout button from profile menu
Then user is logged out from the application

