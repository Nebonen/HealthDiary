DROP DATABASE IF EXISTS HealthDiary;
CREATE DATABASE HealthDiary;
USE HealthDiary;

CREATE TABLE Users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    total_entries INT DEFAULT 0,
    level INT DEFAULT 1,
    experience INT DEFAULT 0,
    experience_to_next_level INT DEFAULT 100,
    current_streak INT DEFAULT 0,
    highest_streak INT DEFAULT 0,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    user_level VARCHAR(10) DEFAULT 'regular'
);

CREATE TABLE DiaryEntries (
    entry_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    entry_date DATE NOT NULL,
    mood VARCHAR(50),
    weight DECIMAL(5,2),
    sleep_hours INT,
    notes TEXT,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES Users(user_id)
);

CREATE TABLE Achievements (
    achievement_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    experience_points INT NOT NULL,
    description VARCHAR(255) NOT NULL,
    requirement VARCHAR(255) NOT NULL
);

CREATE TABLE UserAchievements (
    user_achievement_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    description VARCHAR(255),
    achievement_id INT NOT NULL,
    unlocked_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES Users(user_id)
    FOREING KEY (achievement_id) REFERENCES Achievements(achievement_id)
);

INSERT INTO Users (username, email, password, total_entries, level, experience, experience_to_next_level, current_streak, highest_streak, created_at, user_level) VALUES
('admin', 'admin@admin.com', 'admin123', 0, 1, 0, 100, 0, 0, NOW(), 'admin');