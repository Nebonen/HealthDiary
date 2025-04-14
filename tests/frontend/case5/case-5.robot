*** Settings ***
Library      Browser    
Variables    ../load_env.py

*** Test Cases ***
Login to HealthDiary with .env
    Log    password: ${PASSWORD}
    Log    email: ${EMAIL}
    
    New Browser    chromium    headless=No
    New Page    http://localhost:5173

    # Get the page title and check that it is as expected
    ${PageTitle}=  Get Title 
    Should Be Equal As Strings    ${PageTitle}    Daily Tracker - Login

    # Write the username and password
    Type Text    id=login-email       ${EMAIL}
    Type Secret  id=login-password    $PASSWORD
    
    # Get the element for the login button and click it
    ${login}=    Get Element    xpath=//button[@class="auth-btn" and text()="Login"]
    Click    ${login}