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

/**
 * @api {post} /api/auth/register Register a new user
 * @apiName RegisterUser
 * @apiGroup Authentication
 *
 * @apiBody {String} username User's username
 * @apiBody {String} email User's email address
 * @apiBody {String} password User's password
 *
 * @apiSuccess {String} message Success message
 * @apiSuccess {Object} user User's basic information
 * @apiSuccess {Number} user.userId User ID
 * @apiSuccess {String} user.username Username
 * @apiSuccess {String} user.email Email address
 *
 * @apiError {Object} 400 Bad Request - Missing required fields
 * @apiError {Object} 409 Conflict - Email already exists
 */
router.post(
  '/auth/register',
  registerValidation,
  validationErrorHandler,
  userController.registerUser,
);

/**
 * @api {post} /api/auth/login Login user
 * @apiName LoginUser
 * @apiGroup Authentication
 *
 * @apiBody {String} email User's email address
 * @apiBody {String} password User's password
 *
 * @apiSuccess {String} token JWT authentication token
 * @apiSuccess {Object} user User information
 *
 * @apiError {Object} 400 Bad Request - Missing required fields
 * @apiError {Object} 401 Unauthorized - Invalid credentials
 */
router.post(
  '/auth/login',
  loginValidation,
  validationErrorHandler,
  userController.loginUser,
);

/**
 * @api {get} /api/auth/validate Validate authentication token
 * @apiName ValidateToken
 * @apiGroup Authentication
 *
 * @apiHeader {String} Authorization Bearer token
 *
 * @apiSuccess {Object} user User information
 *
 * @apiError {Object} 401 Unauthorized - Invalid or expired token
 */
router.get('/auth/validate', authenticate, userController.validateToken);

/**
 * @api {get} /api/users/profile Get current user profile
 * @apiName GetUserProfile
 * @apiGroup User
 *
 * @apiHeader {String} Authorization Bearer token
 *
 * @apiSuccess {Object} user User profile information
 *
 * @apiError {Object} 401 Unauthorized - Invalid or expired token
 */
router.get('/users/profile', authenticate, userController.getUserProfile);

/**
 * @api {delete} /api/users/profile Delete current user account
 * @apiName DeleteUserAccount
 * @apiGroup User
 *
 * @apiHeader {String} Authorization Bearer token
 *
 * @apiSuccess {String} message Success message
 *
 * @apiError {Object} 401 Unauthorized - Invalid or expired token
 * @apiError {Object} 500 Internal Server Error
 */
router.delete('/users/profile', authenticate, userController.deleteUserAccount);

/**
 * @api {get} /api/achievements Get all achievements
 * @apiName GetAllAchievements
 * @apiGroup Achievements
 *
 * @apiHeader {String} Authorization Bearer token
 *
 * @apiSuccess {Object[]} achievements List of all achievements
 *
 * @apiError {Object} 401 Unauthorized - Invalid or expired token
 */
router.get(
  '/achievements',
  authenticate,
  achievementController.getAllAchievements,
);

/**
 * @api {get} /api/users/achievements Get current user achievements
 * @apiName GetUserAchievements
 * @apiGroup Achievements
 *
 * @apiHeader {String} Authorization Bearer token
 *
 * @apiSuccess {Object[]} achievements List of user's achievements
 *
 * @apiError {Object} 401 Unauthorized - Invalid or expired token
 */
router.get(
  '/users/achievements',
  authenticate,
  achievementController.getUserAchievements,
);

export default router;
