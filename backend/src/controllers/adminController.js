import * as userModel from '../models/userModel.js';
import * as adminModel from '../models/adminModel.js';

/**
 * Get all users
 */
const getAllUsers = async (req, res, next) => {
  try {
    const users = await adminModel.getAllUsers();
    res.json(users);
  } catch (error) {
    next(error);
  }
};

/**
 * Get a user by ID
 */
const getUserById = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const user = await adminModel.getUserWithDetails(userId);

    if (!user) {
      return res.status(404).json({message: 'User not found'});
    }

    res.json(user);
  } catch (error) {
    next(error);
  }
};

/**
 * Update user access level (regular/admin)
 */
const updateUserLevel = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const {userLevel} = req.body;

    // Validate input
    if (!userLevel || !['regular', 'admin'].includes(userLevel)) {
      return res.status(400).json({
        message: 'Invalid user level. Must be "regular" or "admin"',
      });
    }

    const success = await adminModel.updateUserLevel(userId, userLevel);

    if (!success) {
      return res.status(404).json({message: 'User not found'});
    }

    res.json({message: 'User level updated successfully'});
  } catch (error) {
    next(error);
  }
};

/**
 * Delete a user
 */
const deleteUser = async (req, res, next) => {
  try {
    const userId = req.params.id;

    // Don't allow admins to delete themselves
    if (userId == req.user.userId) {
      return res.status(400).json({
        message: 'Cannot delete your own account from admin panel',
      });
    }

    const success = await userModel.deleteUser(userId);

    if (!success) {
      return res.status(404).json({message: 'User not found'});
    }

    res.json({message: 'User deleted successfully'});
  } catch (error) {
    next(error);
  }
};

/**
 * Get system statistics
 */
const getSystemStats = async (req, res, next) => {
  try {
    const stats = await adminModel.getSystemStats();
    res.json(stats);
  } catch (error) {
    next(error);
  }
};

export {getAllUsers, getUserById, updateUserLevel, deleteUser, getSystemStats};
