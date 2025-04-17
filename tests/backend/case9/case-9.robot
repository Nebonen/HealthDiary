*** Settings ***
Library    RequestsLibrary
Library    Collections
Suite Setup    Authenticate as Admin

*** Keywords ***
Authenticate as Admin
    [Documentation]  Kirjaudutaan sisään ylläpitäjän oikeuksilla.
    ...              - Aluksi luodaan rakenne (Dictionary), joka sisältää käyttäjänimen ja salasanan
    ...              - body-rakenne annetaan POST metodille JSON-parametrina
    ...              - Palautteena tuleva JSON-rakenne tulostetaan lokitiedostoon
    ...              - JSON rakenteesta kaivetaan esiin token
    ...              - Token tulostetaan myös lokitiedostoon
    ...              - Lopuksi token tallennetaa testijoukon muuttujiin muita kutsuja varten 
    ${body}    Create Dictionary    email=admin@healthdiary.com    password=admin123
    ${response}    POST    url=http://localhost:3000/api/auth/login    json=${body}
    Log    ${response.json()}
    ${token}    Set Variable    ${response.json()}[token]
    Log    ${token}
    Set Suite Variable    ${token}

*** Test Cases ***
Get all users
    [Documentation]  Haetaan käyttäjän päiväkirjamerkinnät
    ...              - Kirjaudutaan sisään ylläpitäjän oikeuksilla
    ...              - Haetaan kaikki käyttäjät
    ...              - Palautteena tuleva JSON-rakenne tulostetaan lokitiedostoon
    ${headers}    Create Dictionary    Authorization=Bearer ${token}
    ${response}    GET    url=http://localhost:3000/api/admin/users  headers=${headers}
    Status Should Be    200
    Log List   ${response.json()}
