import express from 'express';
import * as achievementController from '../controllers/achievementController.js';
import authenticate from '../middlewares/authentication.js';
import authorize from '../middlewares/authorization.js';
import {validationErrorHandler} from '../middlewares/errorHandler.js';
import {
  achievementValidation,
  idParamValidation,
} from '../utils/validators/achievementValidator.js';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Get all achievements
router.get('/', achievementController.getAllAchievements);

// Get current user's achievements
router.get('/user', achievementController.getUserAchievements);

// Admin only routes
router.post(
  '/',
  authenticate,
  authorize(['admin']),
  achievementValidation,
  validationErrorHandler,
  achievementController.createAchievement,
);

router.put(
  '/:id',
  authenticate,
  authorize(['admin']),
  idParamValidation,
  achievementValidation,
  validationErrorHandler,
  achievementController.updateAchievement,
);

router.delete(
  '/:id',
  authenticate,
  authorize(['admin']),
  idParamValidation,
  validationErrorHandler,
  achievementController.deleteAchievement,
);

export default router;
