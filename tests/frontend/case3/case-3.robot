*** Settings ***
Documentation     Test suite for Selenium Web Form demo page
Library           Browser
Suite Setup       Open Browser To Form Page
Suite Teardown    Close Browser

*** Variables ***
${URL}            https://www.selenium.dev/selenium/web/web-form.html
${BROWSER}        chromium

*** Test Cases ***
Test Text Input Fields
    Fill Text Input Fields
    Validate Text Input Fields

Test Dropdown Fields
    Select Dropdown Options
    Validate Dropdown Selections

Test Checkbox And Radio Button
    Toggle Checkbox
    Select Radio Button
    Validate Checkbox And Radio Button

Test Form Submission
    Submit Form
    Validate Form Submission

*** Keywords ***
Open Browser To Form Page
    New Browser    browser=${BROWSER}    headless=False
    New Context    viewport={'width': 1280, 'height': 720}    acceptDownloads=True
    New Page       ${URL}
    Wait For Elements State    h1    visible

Fill Text Input Fields
    Fill Text    id=my-text-id    Robot Framework Test
    Fill Text    xpath=//textarea    This is a test message from Robot Framework.
    Fill Text    xpath=//input[@name='my-password']    password123

Validate Text Input Fields
    Get Text    id=my-text-id    ==    Robot Framework Test
    Get Text    xpath=//textarea    ==    This is a test message from Robot Framework.

Select Dropdown Options
    Select Options By    xpath=//select[@name='my-select']    text    Three
    Click    xpath=//input[@list='my-options']

Validate Dropdown Selections
    Get Selected Options    xpath=//select[@name='my-select']    text    ==    Three

Validate File Upload
    ${file_name}=    Get Attribute    xpath=//input[@type='file']    files
    Should Not Be Empty    ${file_name}

Toggle Checkbox
    Check Checkbox    id=my-check-1
    Uncheck Checkbox    id=my-check-2

Select Radio Button
    Click    id=my-radio-2

Validate Checkbox And Radio Button
    Get Checkbox State    id=my-check-1    ==    checked
    Get Checkbox State    id=my-check-2    ==    unchecked
    ${states}=    Get Element States    id=my-radio-2
    Should Contain    ${states}    checked  

Submit Form
    Click    xpath=//button[@type='submit']

Validate Form Submission
    Wait For Elements State    h1:text-is("Form submitted")    visible
    Get Text    css=.lead    contains    Received!