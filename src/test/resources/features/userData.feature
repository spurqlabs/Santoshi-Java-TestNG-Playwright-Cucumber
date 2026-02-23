Feature: User Management in OrangeHRM

Background:
  Given user is on OrangeHRM login page
  When user enter username
  When user enter password
  When user click on Login button
  Then the user is logged in to the application
  Given User_on_Dashboard_Page
  
  @smoke4
  Scenario: TC009 - Add New User
  When user click on Admin menu
  Then user navigate to viewSystemUsers page
  When user click on addbutton
  Then user navigate to saveSystemUser page
  When user select User Role "<UserRole>"
  When user enter EmployeeName "<EmployeeName>"
  When user select Status "<status>"
  When user enter Username "<username>"
  When user enter Password "<password>"
  When user enter Confirm Password "<confirmpassword>"
  When user click SAVE_Button
  Then the new user is added successfully
  When user enter created first Username and click search button "<username>"
  Then Username is displayed in the System user list 
  When user enter created second User_name and click search button "<username>"
  Then User_name is displayed in the System_user list 


  Examples:
  | UserRole | EmployeeName       | status   | username    | password   | confirmpassword  |
  | Admin    | manda akhil user   | Enabled  | doeadmin    | welcome123 | welcome123       |
  | ESS      | joker john selvam  | Disabled | thomasuser  | welcome456 | welcome456       |

@regression3
  Scenario: TC010 - Edit user details
    When user click on Admin left menu
    When user enter username in search box "<username>" and click on Search button
    Then the entered user is displayed on the screen 
    When user click on Edit button
    Then user navigate to save_SystemUser page
    When user change the User role "<newUserRole>"
    When user changed the status "<newStatus>"
    When user click on SAVE Button
    Then user details is updated sucessfully
    When user enter user_Name and click search button "<username>"
    Then Updated data is displayed 
    

    
Examples:
 | username   | newUserRole  | newStatus |
 | doeadmin   | ESS          | Disabled  |
 | thomasuser | Admin        | Enabled   |

@regression4
Scenario: TC011 - Delete User 
When user click on Admin left tab
When user enter User_Name in search box "<username>" and click on Search button
Then the Entered User_Name is displayed on the screen 
When user click on delete icon 
When user click on Yes, Delete button from the pop up 
Then the user is deleted successfully and should not be displayed in the list

Examples:
| username   |  
| doeadmin   |

@negative
Scenario: TC012 - Add duplicate username
    When user click Admin left menu
    When user click on Add
    Then user_navigate_to_saveSystemUser_page
    When user select UserRole "<UserRole>"
    When user enter Employee_Name "<EmployeeName>"
    When user select_Status "<status>"
    When user enter Duplicate Username "<username>"
    Then Already exists error message is displayed
    When user click_profile icon and select logout option
    Then user is getting logged out successfully
    
    Examples:
  | UserRole | EmployeeName          | status   | username   |  
  | ESS      | Test Automation User  | Enabled  | doeadmin   |
