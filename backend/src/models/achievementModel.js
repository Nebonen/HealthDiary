import promisePool from '../utils/database.js';

/**
 * Get all achievements
 * @returns {Promise<Array>} List of achievements
 */
const getAllAchievements = async () => {
  try {
    const [rows] = await promisePool.query('SELECT * FROM Achievements');
    return rows;
  } catch (error) {
    console.error('getAllAchievements error:', error);
    throw error;
  }
};

/**
 * Get achievement by ID
 * @param {number} achievementId - Achievement ID
 * @returns {Promise<Object|null>} Achievement or null if not found
 */
const getAchievementById = async (achievementId) => {
  try {
    const [rows] = await promisePool.query(
      'SELECT * FROM Achievements WHERE achievement_id = ?',
      [achievementId],
    );
    return rows.length > 0 ? rows[0] : null;
  } catch (error) {
    console.error('getAchievementById error:', error);
    throw error;
  }
};

/**
 * Get user's achievements
 * @param {number} userId - User ID
 * @returns {Promise<Array>} List of user achievements
 */
const getUserAchievements = async (userId) => {
  try {
    const [rows] = await promisePool.query(
      `SELECT ua.user_achievement_id, ua.user_id, ua.unlocked_at, 
       a.achievement_id, a.name, a.description, a.experience_points, a.requirement
       FROM UserAchievements ua
       JOIN Achievements a ON ua.achievement_id = a.achievement_id
       WHERE ua.user_id = ?`,
      [userId],
    );
    return rows;
  } catch (error) {
    console.error('getUserAchievements error:', error);
    throw error;
  }
};

/**
 * Create a new achievement
 * @param {Object} achievement - Achievement data
 * @returns {Promise<Object>} Created achievement
 */
const createAchievement = async (achievement) => {
  try {
    const [result] = await promisePool.query(
      'INSERT INTO Achievements (name, description, experience_points, requirement) VALUES (?, ?, ?, ?)',
      [
        achievement.name,
        achievement.description,
        achievement.experience_points,
        achievement.requirement,
      ],
    );

    return {
      achievement_id: result.insertId,
      ...achievement,
    };
  } catch (error) {
    console.error('createAchievement error:', error);
    throw error;
  }
};

/**
 * Update an achievement
 * @param {number} achievementId - Achievement ID
 * @param {Object} achievement - Updated achievement data
 * @returns {Promise<Object|null>} Updated achievement or null if failed
 */
const updateAchievement = async (achievementId, achievement) => {
  try {
    const [result] = await promisePool.query(
      'UPDATE Achievements SET name = ?, description = ?, experience_points = ?, requirement = ? WHERE achievement_id = ?',
      [
        achievement.name,
        achievement.description,
        achievement.experience_points,
        achievement.requirement,
        achievementId,
      ],
    );

    if (result.affectedRows === 0) {
      return null;
    }

    return {
      achievement_id: parseInt(achievementId),
      ...achievement,
    };
  } catch (error) {
    console.error('updateAchievement error:', error);
    throw error;
  }
};

/**
 * Delete an achievement
 * @param {number} achievementId - Achievement ID
 * @returns {Promise<boolean>} Success indicator
 */
const deleteAchievement = async (achievementId) => {
  try {
    // First check if there are any user achievements linked to this achievement
    const [userAchievements] = await promisePool.query(
      'SELECT user_achievement_id FROM UserAchievements WHERE achievement_id = ?',
      [achievementId],
    );

    // If there are user achievements, we shouldn't delete the achievement
    if (userAchievements.length > 0) {
      throw new Error(
        'Cannot delete achievement that has been awarded to users',
      );
    }

    const [result] = await promisePool.query(
      'DELETE FROM Achievements WHERE achievement_id = ?',
      [achievementId],
    );

    return result.affectedRows > 0;
  } catch (error) {
    console.error('deleteAchievement error:', error);
    throw error;
  }
};

/**
 * Unlock an achievement for a user
 * @param {number} userId - User ID
 * @param {number} achievementId - Achievement ID
 * @returns {Promise<Object>} Unlocked achievement
 */
const unlockAchievement = async (userId, achievementId) => {
  try {
    // Check if user already has this achievement
    const [existingAchievements] = await promisePool.query(
      'SELECT * FROM UserAchievements WHERE user_id = ? AND achievement_id = ?',
      [userId, achievementId],
    );

    if (existingAchievements.length > 0) {
      return null; // Already unlocked
    }

    // Get the achievement details
    const [achievements] = await promisePool.query(
      'SELECT * FROM Achievements WHERE achievement_id = ?',
      [achievementId],
    );

    if (achievements.length === 0) {
      throw new Error('Achievement not found');
    }

    const achievement = achievements[0];

    // Insert into UserAchievements
    await promisePool.query(
      'INSERT INTO UserAchievements (user_id, achievement_id, description) VALUES (?, ?, ?)',
      [userId, achievementId, achievement.description],
    );

    // Award experience points to the user
    await promisePool.query(
      'UPDATE Users SET experience = experience + ? WHERE user_id = ?',
      [achievement.experience_points, userId],
    );

    // Return the unlocked achievement
    return {
      ...achievement,
      unlocked_at: new Date(),
    };
  } catch (error) {
    console.error('unlockAchievement error:', error);
    throw error;
  }
};

/**
 * Check achievements for a user after a diary entry
 * @param {number} userId - User ID
 * @returns {Promise<Array>} List of newly unlocked achievements
 */
const checkAchievements = async (userId) => {
  try {
    // Get user stats
    const [userRows] = await promisePool.query(
      'SELECT total_entries, current_streak, highest_streak FROM Users WHERE user_id = ?',
      [userId],
    );

    if (userRows.length === 0) {
      throw new Error('User not found');
    }

    const user = userRows[0];
    const newAchievements = [];

    // Get all achievements the user doesn't have yet
    const [availableAchievements] = await promisePool.query(
      `SELECT * FROM Achievements WHERE achievement_id NOT IN 
       (SELECT achievement_id FROM UserAchievements WHERE user_id = ?)`,
      [userId],
    );

    // Check each achievement against user stats
    for (const achievement of availableAchievements) {
      let shouldUnlock = false;

      // Check achievement requirements
      if (
        achievement.requirement.includes('entries') &&
        user.total_entries >= parseInt(achievement.requirement.match(/\d+/)[0])
      ) {
        shouldUnlock = true;
      } else if (
        achievement.requirement.includes('streak') &&
        user.current_streak >= parseInt(achievement.requirement.match(/\d+/)[0])
      ) {
        shouldUnlock = true;
      }

      // Unlock achievement if requirements are met
      if (shouldUnlock) {
        const unlockedAchievement = await unlockAchievement(
          userId,
          achievement.achievement_id,
        );
        if (unlockedAchievement) {
          newAchievements.push(unlockedAchievement);
        }
      }
    }

    return newAchievements;
  } catch (error) {
    console.error('checkAchievements error:', error);
    throw error;
  }
};

export {
  getAllAchievements,
  getAchievementById,
  getUserAchievements,
  createAchievement,
  updateAchievement,
  deleteAchievement,
  unlockAchievement,
  checkAchievements,
};
