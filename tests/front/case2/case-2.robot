*** Settings ***
Library     Browser
Resource    ../Keywords.robot

*** Test Cases ***
Login to HealthDiary
    New Browser    chromium    headless=No
    New Page    http://localhost:5173

    # Hae sivun otsikko ja tarkista, että se on odotettu
    ${PageTitle}=  Get Title 
    Should Be Equal As Strings    ${PageTitle}    Daily Tracker - Login

    # Kirjoita käyttäjätunnus ja salasana
    Type Text    id=login-email    ${email}
    Type Secret  id=login-password    $password
    
    # Hae elementti kirjautumispainikkeelle ja napsauta sitä
    ${login}=    Get Element    xpath=//button[@class="auth-btn" and text()="Login"]
    Click    ${login}