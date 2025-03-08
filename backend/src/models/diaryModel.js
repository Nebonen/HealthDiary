import db from '../utils/database.js';
import * as achievementModel from './achievementModel.js';

/**
 * Create a new diary entry
 * @param {Object} entry - Entry data
 * @returns {Promise<Object>} Created entry
 */
const createEntry = async (entry) => {
  try {
    const [result] = await db.execute(
      'INSERT INTO DiaryEntries (user_id, entry_date, mood, weight, sleep_hours, notes) VALUES (?, ?, ?, ?, ?, ?)',
      [
        entry.userId,
        entry.date,
        entry.mood,
        entry.weight || null,
        entry.sleep || null,
        entry.notes || null,
      ],
    );

    // Check for achievements after adding an entry
    const newAchievements = await achievementModel.checkAchievements(
      entry.userId,
    );

    return {
      entry_id: result.insertId,
      ...entry,
      achievements: newAchievements,
    };
  } catch (error) {
    console.error('createEntry error:', error);
    throw error;
  }
};

/**
 * Get all entries for a user
 * @param {number} userId - User ID
 * @returns {Promise<Array>} List of entries
 */
const getEntriesByUserId = async (userId) => {
  try {
    const [rows] = await db.execute(
      'SELECT * FROM DiaryEntries WHERE user_id = ? ORDER BY entry_date DESC',
      [userId],
    );
    return rows;
  } catch (error) {
    console.error('getEntriesByUserId error:', error);
    throw error;
  }
};

/**
 * Get entry by ID
 * @param {number} entryId - Entry ID
 * @param {number} userId - User ID (for verification)
 * @returns {Promise<Object|null>} Entry object or null if not found
 */
const getEntryById = async (entryId, userId) => {
  try {
    const [rows] = await db.execute(
      'SELECT * FROM DiaryEntries WHERE entry_id = ? AND user_id = ?',
      [entryId, userId],
    );
    return rows.length > 0 ? rows[0] : null;
  } catch (error) {
    console.error('getEntryById error:', error);
    throw error;
  }
};

/**
 * Update an existing entry
 * @param {number} entryId - Entry ID
 * @param {Object} entry - Updated entry data
 * @param {number} userId - User ID (for verification)
 * @returns {Promise<boolean>} Success indicator
 */
const updateEntry = async (entryId, entry, userId) => {
  try {
    const [result] = await db.execute(
      'UPDATE DiaryEntries SET mood = ?, weight = ?, sleep_hours = ?, notes = ? WHERE entry_id = ? AND user_id = ?',
      [
        entry.mood,
        entry.weight || null,
        entry.sleep || null,
        entry.notes || null,
        entryId,
        userId,
      ],
    );

    return result.affectedRows > 0;
  } catch (error) {
    console.error('updateEntry error:', error);
    throw error;
  }
};

/**
 * Delete an entry
 * @param {number} entryId - Entry ID
 * @param {number} userId - User ID (for verification)
 * @returns {Promise<boolean>} Success indicator
 */
const deleteEntry = async (entryId, userId) => {
  try {
    const [result] = await db.execute(
      'DELETE FROM DiaryEntries WHERE entry_id = ? AND user_id = ?',
      [entryId, userId],
    );

    return result.affectedRows > 0;
  } catch (error) {
    console.error('deleteEntry error:', error);
    throw error;
  }
};

export {
  createEntry,
  getEntriesByUserId,
  getEntryById,
  updateEntry,
  deleteEntry,
};
