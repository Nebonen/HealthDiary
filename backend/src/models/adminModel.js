import promisePool from '../utils/database.js';

/**
 * Get all users in the system
 * @returns {Promise<Array>} List of users
 */
const getAllUsers = async () => {
  try {
    const [rows] = await promisePool.query(
      `SELECT 
        user_id, username, email, total_entries, 
        level, experience, current_streak, highest_streak, 
        user_level, created_at
      FROM Users
      ORDER BY created_at DESC`,
    );
    return rows;
  } catch (error) {
    console.error('getAllUsers error:', error);
    throw error;
  }
};

/**
 * Get detailed user information including entries count and achievements
 * @param {number} userId - User ID
 * @returns {Promise<Object|null>} User details or null if not found
 */
const getUserWithDetails = async (userId) => {
  try {
    // Get user basic info
    const [userRows] = await promisePool.query(
      `SELECT 
        user_id, username, email, total_entries, 
        level, experience, current_streak, highest_streak, 
        user_level, created_at
      FROM Users
      WHERE user_id = ?`,
      [userId],
    );

    if (userRows.length === 0) {
      return null;
    }

    const user = userRows[0];

    // Get count of entries
    const [entryCountRows] = await promisePool.query(
      'SELECT COUNT(*) as total FROM DiaryEntries WHERE user_id = ?',
      [userId],
    );

    // Get user achievements
    const [achievementRows] = await promisePool.query(
      `SELECT a.name, a.description, ua.unlocked_at
       FROM UserAchievements ua
       JOIN Achievements a ON ua.achievement_id = a.achievement_id
       WHERE ua.user_id = ?`,
      [userId],
    );

    // Return combined data
    return {
      ...user,
      entriesCount: entryCountRows[0].total,
      achievements: achievementRows,
    };
  } catch (error) {
    console.error('getUserWithDetails error:', error);
    throw error;
  }
};

/**
 * Update user access level
 * @param {number} userId - User ID
 * @param {string} userLevel - New user level ('regular' or 'admin')
 * @returns {Promise<boolean>} Success indicator
 */
const updateUserLevel = async (userId, userLevel) => {
  try {
    const [result] = await promisePool.query(
      'UPDATE Users SET user_level = ? WHERE user_id = ?',
      [userLevel, userId],
    );

    return result.affectedRows > 0;
  } catch (error) {
    console.error('updateUserLevel error:', error);
    throw error;
  }
};

/**
 * Get system statistics
 * @returns {Promise<Object>} System statistics
 */
const getSystemStats = async () => {
  try {
    // Total users count
    const [userCountRows] = await promisePool.query(
      'SELECT COUNT(*) as total FROM Users',
    );

    // Total entries count
    const [entryCountRows] = await promisePool.query(
      'SELECT COUNT(*) as total FROM DiaryEntries',
    );

    // New users in the past 30 days
    const [newUsersRows] = await promisePool.query(
      'SELECT COUNT(*) as total FROM Users WHERE created_at > DATE_SUB(NOW(), INTERVAL 30 DAY)',
    );

    // New entries in the past 30 days
    const [newEntriesRows] = await promisePool.query(
      'SELECT COUNT(*) as total FROM DiaryEntries WHERE created_at > DATE_SUB(NOW(), INTERVAL 30 DAY)',
    );

    // User achievement count
    const [achievementCountRows] = await promisePool.query(
      'SELECT COUNT(*) as total FROM UserAchievements',
    );

    return {
      totalUsers: userCountRows[0].total,
      totalEntries: entryCountRows[0].total,
      newUsers30Days: newUsersRows[0].total,
      newEntries30Days: newEntriesRows[0].total,
      totalAchievementsEarned: achievementCountRows[0].total,
    };
  } catch (error) {
    console.error('getSystemStats error:', error);
    throw error;
  }
};

export {getAllUsers, getUserWithDetails, updateUserLevel, getSystemStats};
