# Health Diary

A school project

## Screenshots

![Login/Register page](images/loginRegister.png)

![Home page](images/home.png)

![Profile page](images/profile.png)

![Admin dashboard with user management](images/adminUsers.png)

![Admin dashboard with achievement management](images/adminAchievements.png)

## Links to app

[frontend - localhost:5173](https://localhost:5173/)

[backend - localhost:3000](https://localhost:3000/)

## API Documentation

[apidoc](https://users.metropolia.fi/~miskanu/Web-sovelluskehitys/docs/)

## Database

```mermaid
erDiagram
Users {
    int user_id PK "Primary Key"
    varchar username
    varchar email
    varchar password
    int total_entries
    int level
    int exprerience
    int exprerience_to_next_level
    int current_streak
    int highest_streak
    datetime created_at
    enum user_level "Regular | Admin"
}
DiaryEntries {
    int entry_id PK "Primary Key"
    int user_id FK "Foreign Key"
    date entry_date
    varchar mood
    decimal weight
    int sleep_hours
    text notes
    datetime created_at
}
Achievements {
    int achievement_id PK "Primary Key"
    varchar name
    int exprerience_points
    varchar description
    varchar requirement
}
UserAchievement {
    int user_achievement_id PK "Primary Key"
    int user_id FK "Foreign Key"
    int achievement_id FK "Foreign Key"
    varchar description
    timestamp unlocked_at
}
Users ||--o{ DiaryEntries : "has"
Users }|--|{ UserAchievement : "has"
Achievements ||--|| UserAchievement : "has"
```

## Features

- Leveling
- Achievements
- Entry streak
- Admin dashboard

## Bugs/problems

- The user cannot get the achievements "First entry", "Weight loss" or "Sleep improvement".
- Achievements "Weekly streak" and "Monthly streak" condition is checked from total entries, not highest streak (?).
- When deleting an entry, activity stats won't update.

## References

For help and problems with code, I used Claude 3.7 Sonnet and GitHub Copilot.

[color pallette](https://colorhunt.co/palette/22283131363f76abaeeeeeee)

## Tests

[Documentation](tests/README.md)
