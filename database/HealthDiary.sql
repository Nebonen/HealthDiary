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

INSERT INTO Achievements (name, experience_points, description, requirement) VALUES
('First Entry', 10, 'Make your first diary entry.', 'Create 1 diary entry.'),
('Weekly Streak', 20, 'Maintain a streak of 7 days.', 'Create 7 diary entries in a week.'),
('Monthly Streak', 50, 'Maintain a streak of 30 days.', 'Create 30 diary entries in a month.'),
('Weight Loss', 30, 'Lose 5 kg.', 'Lose 5 kg from your initial weight.'),
('Sleep Improvement', 20, 'Average sleep hours above 7.', 'Average sleep hours above 7 for a month.');

-- Admin user with password "admin123" (bcrypt hashed)
INSERT INTO Users (username, email, password, user_level) VALUES
('admin', 'admin@healthdiary.com', '$2b$10$OG0BUWaZo/oIqm.jsSMiEet0CXnIf4gqSC3ZfIpqlZV51xnW1YBL2', 'admin');