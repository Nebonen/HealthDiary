import * as entryModel from '../models/diaryModel.js';
import * as userModel from '../models/userModel.js';

/**
 * Create a new diary entry
 */
const createEntry = async (req, res, next) => {
  try {
    const {date, mood, weight, sleep, notes} = req.body;
    const userId = req.user.userId;

    // Validate required fields
    if (!date || !mood) {
      return res
        .status(400)
        .json({message: 'Date and mood are required fields'});
    }

    // Create entry
    const newEntry = await entryModel.createEntry({
      userId,
      date,
      mood,
      weight,
      sleep,
      notes,
    });

    // Update user stats (experience, streak, etc.)
    const updatedStats = await userModel.updateUserStats(userId, date);

    // Return the new entry and updated stats
    res.status(201).json({
      message: 'Entry created successfully',
      entry: newEntry,
      userStats: updatedStats,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get all entries for the current user
 */
const getAllEntries = async (req, res, next) => {
  try {
    const userId = req.user.userId;

    // Get entries
    const entries = await entryModel.getEntriesByUserId(userId);

    // Format entries for frontend
    const formattedEntries = entries.map((entry) => ({
      id: entry.entry_id,
      date: entry.entry_date,
      mood: entry.mood,
      weight: entry.weight,
      sleep: entry.sleep_hours,
      notes: entry.notes,
      createdAt: entry.created_at,
    }));

    res.json(formattedEntries);
  } catch (error) {
    next(error);
  }
};

/**
 * Get a single entry by ID
 */
const getEntryById = async (req, res, next) => {
  try {
    const entryId = req.params.id;
    const userId = req.user.userId;

    // Get entry
    const entry = await entryModel.getEntryById(entryId, userId);

    if (!entry) {
      return res.status(404).json({message: 'Entry not found'});
    }

    // Format entry for frontend
    const formattedEntry = {
      id: entry.entry_id,
      date: entry.entry_date,
      mood: entry.mood,
      weight: entry.weight,
      sleep: entry.sleep_hours,
      notes: entry.notes,
      createdAt: entry.created_at,
    };

    res.json(formattedEntry);
  } catch (error) {
    next(error);
  }
};

/**
 * Update an entry
 */
const updateEntry = async (req, res, next) => {
  try {
    const entryId = req.params.id;
    const userId = req.user.userId;
    const {mood, weight, sleep, notes} = req.body;

    // Check if entry exists
    const entry = await entryModel.getEntryById(entryId, userId);
    if (!entry) {
      return res.status(404).json({message: 'Entry not found'});
    }

    // Update entry
    const success = await entryModel.updateEntry(
      entryId,
      {
        mood,
        weight,
        sleep,
        notes,
      },
      userId,
    );

    if (!success) {
      return res.status(400).json({message: 'Failed to update entry'});
    }

    res.json({message: 'Entry updated successfully'});
  } catch (error) {
    next(error);
  }
};

/**
 * Delete an entry
 */
const deleteEntry = async (req, res, next) => {
  try {
    const entryId = req.params.id;
    const userId = req.user.userId;

    // Check if entry exists
    const entry = await entryModel.getEntryById(entryId, userId);
    if (!entry) {
      return res.status(404).json({message: 'Entry not found'});
    }

    // Delete entry
    const success = await entryModel.deleteEntry(entryId, userId);

    if (!success) {
      return res.status(400).json({message: 'Failed to delete entry'});
    }

    res.json({message: 'Entry deleted successfully'});
  } catch (error) {
    next(error);
  }
};

export {createEntry, getAllEntries, getEntryById, updateEntry, deleteEntry};
