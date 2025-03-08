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
    FOREIGN KEY (user_id) REFERENCES Users(user_id),
    FOREIGN KEY (achievement_id) REFERENCES Achievements(achievement_id)
);

INSERT INTO Users (username, email, password, total_entries, level, experience, experience_to_next_level, current_streak, highest_streak, created_at, user_level) VALUES
('admin', 'admin@admin.com', 'admin123', 0, 1, 0, 100, 0, 0, NOW(), 'admin');

INSERT INTO DiaryEntries (user_id, entry_date, mood, weight, sleep_hours, notes) VALUES
(1, '2023-10-01', 'happy', 70.5, 8, 'Had a great day!'),
(1, '2023-10-02', 'sad', 70.0, 7, 'Feeling a bit down.'),
(1, '2023-10-03', 'neutral', 69.5, 6, 'Just an average day.'),
(1, '2023-10-04', 'happy', 70.0, 8, 'Went for a nice walk.'),
(1, '2023-10-05', 'angry', 70.5, 5, 'Had a frustrating day.');

INSERT INTO Achievements (name, experience_points, description, requirement) VALUES
('First Entry', 10, 'Make your first diary entry.', 'Create 1 diary entry.'),
('Weekly Streak', 20, 'Maintain a streak of 7 days.', 'Create 7 diary entries in a week.'),
('Monthly Streak', 50, 'Maintain a streak of 30 days.', 'Create 30 diary entries in a month.'),
('Weight Loss', 30, 'Lose 5 kg.', 'Lose 5 kg from your initial weight.'),
('Sleep Improvement', 20, 'Average sleep hours above 7.', 'Average sleep hours above 7 for a month.');

INSERT INTO UserAchievements (user_id, description, achievement_id) VALUES
(1, 'Unlocked First Entry achievement.', 1),
(1, 'Unlocked Weekly Streak achievement.', 2),
(1, 'Unlocked Monthly Streak achievement.', 3),
(1, 'Unlocked Weight Loss achievement.', 4),
(1, 'Unlocked Sleep Improvement achievement.', 5);