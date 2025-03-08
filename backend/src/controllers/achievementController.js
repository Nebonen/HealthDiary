import * as achievementModel from '../models/achievementModel.js';

/**
 * Get all achievements
 */
const getAllAchievements = async (req, res, next) => {
  try {
    const achievements = await achievementModel.getAllAchievements();
    res.json(achievements);
  } catch (error) {
    next(error);
  }
};

/**
 * Get current user's achievements
 */
const getUserAchievements = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const achievements = await achievementModel.getUserAchievements(userId);
    res.json(achievements);
  } catch (error) {
    next(error);
  }
};

/**
 * Create new achievement (admin only)
 */
const createAchievement = async (req, res, next) => {
  try {
    const {name, description, experience_points, requirement} = req.body;

    // Validate required fields
    if (!name || !description || !experience_points || !requirement) {
      return res.status(400).json({
        message:
          'Missing required fields. Name, description, experience points and requirement are required.',
      });
    }

    const newAchievement = await achievementModel.createAchievement({
      name,
      description,
      experience_points,
      requirement,
    });

    res.status(201).json({
      message: 'Achievement created successfully',
      achievement: newAchievement,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update an achievement (admin only)
 */
const updateAchievement = async (req, res, next) => {
  try {
    const achievementId = req.params.id;
    const {name, description, experience_points, requirement} = req.body;

    // Check if achievement exists
    const achievement =
      await achievementModel.getAchievementById(achievementId);
    if (!achievement) {
      return res.status(404).json({message: 'Achievement not found'});
    }

    const updatedAchievement = await achievementModel.updateAchievement(
      achievementId,
      {
        name,
        description,
        experience_points,
        requirement,
      },
    );

    if (!updatedAchievement) {
      return res.status(400).json({message: 'Failed to update achievement'});
    }

    res.json({
      message: 'Achievement updated successfully',
      achievement: updatedAchievement,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete an achievement (admin only)
 */
const deleteAchievement = async (req, res, next) => {
  try {
    const achievementId = req.params.id;

    // Check if achievement exists
    const achievement =
      await achievementModel.getAchievementById(achievementId);
    if (!achievement) {
      return res.status(404).json({message: 'Achievement not found'});
    }

    const success = await achievementModel.deleteAchievement(achievementId);

    if (!success) {
      return res.status(400).json({message: 'Failed to delete achievement'});
    }

    res.json({message: 'Achievement deleted successfully'});
  } catch (error) {
    next(error);
  }
};

export {
  getAllAchievements,
  getUserAchievements,
  createAchievement,
  updateAchievement,
  deleteAchievement,
};
