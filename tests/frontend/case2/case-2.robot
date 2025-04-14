*** Settings ***
Library     Browser
Resource    ../Keywords.robot

*** Test Cases ***
Login to HealthDiary
    New Browser    chromium    headless=No
    New Page    http://localhost:5173

    # Get the page title and check that it is as expected
    ${PageTitle}=  Get Title 
    Should Be Equal As Strings    ${PageTitle}    Daily Tracker - Login

    # Write the username and password
    Type Text    id=login-email    ${email}
    Type Secret  id=login-password    $password
    
    # Get the element for the login button and click it
    ${login}=    Get Element    xpath=//button[@class="auth-btn" and text()="Login"]
    Click    ${login}