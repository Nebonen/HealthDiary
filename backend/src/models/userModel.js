import db from '../utils/database.js';
import bcrypt from 'bcryptjs';

/**
 * Get user by email
 * @param {string} email - User's email
 * @returns {Promise<Object|null>} User object or null if not found
 */
const getUserByEmail = async (email) => {
  try {
    const [rows] = await db.execute('SELECT * FROM Users WHERE email = ?', [
      email,
    ]);
    return rows.length > 0 ? rows[0] : null;
  } catch (error) {
    console.error('getUserByEmail error:', error);
    throw error;
  }
};

/**
 * Get user by ID
 * @param {number} userId - User's ID
 * @returns {Promise<Object|null>} User object or null if not found
 */
const getUserById = async (userId) => {
  try {
    const [rows] = await db.execute(
      'SELECT user_id, username, email, total_entries, level, experience, experience_to_next_level, current_streak, highest_streak, created_at, user_level FROM Users WHERE user_id = ?',
      [userId],
    );
    return rows.length > 0 ? rows[0] : null;
  } catch (error) {
    console.error('getUserById error:', error);
    throw error;
  }
};

/**
 * Create a new user
 * @param {Object} user - User data
 * @returns {Promise<Object>} Created user
 */
const createUser = async (user) => {
  try {
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(user.password, salt);

    const [result] = await db.execute(
      'INSERT INTO Users (username, email, password) VALUES (?, ?, ?)',
      [user.username, user.email, hashedPassword],
    );

    return {
      userId: result.insertId,
      username: user.username,
      email: user.email,
    };
  } catch (error) {
    console.error('createUser error:', error);
    throw error;
  }
};

/**
 * Update user stats after entry submission
 * @param {number} userId - User ID
 * @param {Date} entryDate - Date of the entry
 * @returns {Promise<Object>} Updated user stats
 */
const updateUserStats = async (userId, entryDate) => {
  try {
    // First get the current user stats
    const [userRows] = await db.execute(
      'SELECT total_entries, level, experience, experience_to_next_level, current_streak, highest_streak FROM Users WHERE user_id = ?',
      [userId],
    );

    if (userRows.length === 0) {
      throw new Error('User not found');
    }

    const user = userRows[0];

    // Increment total entries
    const newTotalEntries = user.total_entries + 1;

    // Award experience points for new entry
    const experienceGained = 10; // 10 XP per entry
    let newExperience = user.experience + experienceGained;
    let newLevel = user.level;
    let newExperienceToNextLevel = user.experience_to_next_level;

    // Check if user should level up
    while (newExperience >= newExperienceToNextLevel) {
      newExperience -= newExperienceToNextLevel;
      newLevel++;
      newExperienceToNextLevel = Math.floor(newExperienceToNextLevel * 1.2); // Increase XP needed for next level
    }

    // Calculate streak
    // Get the latest entry date before this one
    const [latestEntryRows] = await db.execute(
      'SELECT entry_date FROM DiaryEntries WHERE user_id = ? ORDER BY entry_date DESC LIMIT 1',
      [userId],
    );

    let newCurrentStreak = user.current_streak;
    let newHighestStreak = user.highest_streak;

    const today = new Date();
    const entryDateObj = new Date(entryDate);

    // Format dates to YYYY-MM-DD for comparison
    const todayFormatted = today.toISOString().split('T')[0];
    const entryDateFormatted = entryDateObj.toISOString().split('T')[0];

    // If entry is for today's date
    if (entryDateFormatted === todayFormatted) {
      if (latestEntryRows.length > 0) {
        const latestEntryDate = new Date(latestEntryRows[0].entry_date);
        const latestEntryFormatted = latestEntryDate
          .toISOString()
          .split('T')[0];

        // Check if the latest entry was yesterday
        const yesterday = new Date(today);
        yesterday.setDate(today.getDate() - 1);
        const yesterdayFormatted = yesterday.toISOString().split('T')[0];

        if (latestEntryFormatted === yesterdayFormatted) {
          // Continue the streak
          newCurrentStreak++;
        } else if (latestEntryFormatted !== todayFormatted) {
          // Reset streak if not consecutive days
          newCurrentStreak = 1;
        }
      } else {
        // First entry ever
        newCurrentStreak = 1;
      }

      // Update highest streak if applicable
      if (newCurrentStreak > newHighestStreak) {
        newHighestStreak = newCurrentStreak;
      }
    }

    // Update user stats in the database
    await db.execute(
      'UPDATE Users SET total_entries = ?, level = ?, experience = ?, experience_to_next_level = ?, current_streak = ?, highest_streak = ? WHERE user_id = ?',
      [
        newTotalEntries,
        newLevel,
        newExperience,
        newExperienceToNextLevel,
        newCurrentStreak,
        newHighestStreak,
        userId,
      ],
    );

    return {
      total_entries: newTotalEntries,
      level: newLevel,
      experience: newExperience,
      experience_to_next_level: newExperienceToNextLevel,
      current_streak: newCurrentStreak,
      highest_streak: newHighestStreak,
    };
  } catch (error) {
    console.error('updateUserStats error:', error);
    throw error;
  }
};

export {getUserByEmail, getUserById, createUser, updateUserStats};
