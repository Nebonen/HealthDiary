*** Settings ***
Library     Browser    auto_closing_level=KEEP
Resource    ../Keywords.robot

*** Test Cases ***
Make a new diary entry
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

    # Get the 'great' value from the mood dropdown
    Select Options By    id=mood    value    great

    # Write the weight, sleep and notes
    Type Text    id=weight    70
    Type Text    id=sleep    8
    Type Text    id=notes    This is a test note.

    # Get the element for the submit button and click it
    ${submit}=    Get Element    xpath=//button[@type="submit" and text()="Save Entry"]
    Click    ${submit}