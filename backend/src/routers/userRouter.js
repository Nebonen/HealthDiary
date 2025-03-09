import express from 'express';
import * as userController from '../controllers/userController.js';
import * as achievementController from '../controllers/achievementController.js';
import authenticate from '../middlewares/authentication.js';
import authorize from '../middlewares/authorization.js';
import {validationErrorHandler} from '../middlewares/errorHandler.js';
import {
  registerValidation,
  loginValidation,
} from '../utils/validators/userValidator.js';

const router = express.Router();

// Public routes - authentication
router.post(
  '/auth/register',
  registerValidation,
  validationErrorHandler,
  userController.registerUser,
);
router.post(
  '/auth/login',
  loginValidation,
  validationErrorHandler,
  userController.loginUser,
);
router.get('/auth/validate', authenticate, userController.validateToken);

// Protected routes - require authentication
router.get('/users/profile', authenticate, userController.getUserProfile);
router.delete('/users/profile', authenticate, userController.deleteUserAccount);

// Achievement routes
router.get(
  '/achievements',
  authenticate,
  achievementController.getAllAchievements,
);
router.get(
  '/users/achievements',
  authenticate,
  achievementController.getUserAchievements,
);

export default router;
