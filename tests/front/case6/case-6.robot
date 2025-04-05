*** Settings ***
Library    Browser
Library    CryptoLibrary    variable_decryption=True

*** Variables ***
${EMAIL}       crypt:L3BrwgXIV9/T2/vJjHPswzr8g9R+r+rR837cnx26MWWAfEJzk3HN0akXIjsBP4PYxZVIVBX5VBoS0rvjmrRp5ZKDnw7Z
${PASSWORD}    crypt:ZDSaWXNT7jLloe0QsOo3nWn8OG4xhTC0159vYb4uORG/vQqdjn4UAVsLzCBd7PdFwzLrjvBS918=


*** Test Cases ***
Login to HealthDiary with CryptoLibrary
    New Browser    chromium    headless=No
    New Page    http://localhost:5173

    # Get the page title and check that it is as expected
    ${PageTitle}=  Get Title 
    Should Be Equal As Strings    ${PageTitle}    Daily Tracker - Login

    # Write the username and password
    Type Text    id=login-email    ${EMAIL}
    Type Secret  id=login-password    $PASSWORD
    
    # Get the element for the login button and click it
    ${login}=    Get Element    xpath=//button[@class="auth-btn" and text()="Login"]
    Click    ${login}