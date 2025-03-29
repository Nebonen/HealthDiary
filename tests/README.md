# Test documentation

For testing I use Robot Framework

## Case 1. Installing Robot Framework and libraries

### 1. Virtual enviroment

Create .venv folder

```bash
python -m venv .venv
```

Activate the virtual enviroment

- Windows

```bash
.venv\Scripts\activate
```

- macOS

```bash
source .venv/bin/activate
```

Add .venv folder to .gitignore.

### 2. Install Robot Framework

Install Robot Framework

```bash
pip install robotframework
```

Install Browser library

```bash
pip install robotframework-browser
```

Initialize the library

```bash
rfbrowser init
```

Install Requests library

```bash
pip install robotframework-requests
```

Install Crypto library

```bash
pip install --upgrade robotframework-crypto
```

Install Robotidy

```bash
pip install robotframework-tidy
```

### 3. Create `requirements.txt`

```bash
pip freeze > requirements.txt
```

This generates the `requirements.txt` which includes the list from `pip freeze`

### 4. Test the installation

I tested the installation using [asennustesti.py](asennustesti.py)

![Installation](../images/Installation.png)

## Case 2. HealthDiary login test

```robotframework
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
```

- `Resource    ../Keywords.robot` refrence to a file similar to .env. It contains passwords and other sensitive variables.
- `New Browser    chromium    headless=No` Open a new Chromium window in a no-headless state, so the window opens during testing.
- `New Page    http://localhost:5173` Open a new tab and loads the given URL.
- `${PageTitle}=  Get Title`
  `Should Be Equal As Strings    ${PageTitle}    Daily Tracker - Login` Check that the tab title is "Daily Tracker - Login".
- `Type Text    id=login-email    ${email}` Get `email` variable from `keywords.robot` and write it into a text field with id `login-email`.
- `Type Secret  id=login-password    $password` Get `password` variable from `keywords.robot` and write it into a password field with id `login-password`.
- `${login}=    Get Element    xpath=//button[@class="auth-btn" and text()="Login"]`
  `Click    ${login}` Get login button element through xpath and click it.

And then run the test in terminal with command

```bash
robot case-2.robot
```

![Case2](../images/case2.png)
