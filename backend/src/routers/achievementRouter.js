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

/**
 * @api {get} /api/achievements Get all achievements
 * @apiName GetAllAchievements
 * @apiGroup Achievements
 *
 * @apiHeader {String} Authorization Bearer token
 *
 * @apiSuccess {Object[]} achievements List of all achievements
 *
 * @apiError {Object} 401 Unauthorized - Not authenticated
 */
router.get('/', achievementController.getAllAchievements);

/**
 * @api {get} /api/achievements/:id Get achievement by ID
 * @apiName GetAchievementById
 * @apiGroup Achievements
 *
 * @apiHeader {String} Authorization Bearer token
 * @apiParam {Number} id Achievement ID
 *
 * @apiSuccess {Object} achievement Achievement details
 *
 * @apiError {Object} 401 Unauthorized - Not authenticated
 * @apiError {Object} 404 Not Found - Achievement not found
 */
router.get('/:id', achievementController.getAchievementById);

/**
 * @api {get} /api/achievements/user Get user achievements
 * @apiName GetUserAchievements
 * @apiGroup Achievements
 *
 * @apiHeader {String} Authorization Bearer token
 *
 * @apiSuccess {Object[]} achievements List of user's achievements
 *
 * @apiError {Object} 401 Unauthorized - Not authenticated
 */
router.get('/user', achievementController.getUserAchievements);

/**
 * @api {post} /api/achievements Create achievement
 * @apiName CreateAchievement
 * @apiGroup Achievements
 *
 * @apiHeader {String} Authorization Bearer token
 *
 * @apiBody {String} name Achievement name
 * @apiBody {String} description Achievement description
 * @apiBody {String} criteria Achievement criteria
 * @apiBody {Number} points Achievement points
 * @apiBody {String} [badgeUrl] URL to achievement badge image
 *
 * @apiSuccess {Object} achievement Created achievement
 *
 * @apiError {Object} 400 Bad Request - Invalid input
 * @apiError {Object} 401 Unauthorized - Not authenticated
 * @apiError {Object} 403 Forbidden - Not authorized as admin
 */
router.post(
  '/',
  authenticate,
  authorize(['admin']),
  achievementValidation,
  validationErrorHandler,
  achievementController.createAchievement,
);

/**
 * @api {put} /api/achievements/:id Update achievement
 * @apiName UpdateAchievement
 * @apiGroup Achievements
 *
 * @apiHeader {String} Authorization Bearer token
 * @apiParam {Number} id Achievement ID
 *
 * @apiBody {String} [name] Updated name
 * @apiBody {String} [description] Updated description
 * @apiBody {String} [criteria] Updated criteria
 * @apiBody {Number} [points] Updated points
 * @apiBody {String} [badgeUrl] Updated badge URL
 *
 * @apiSuccess {Object} achievement Updated achievement
 *
 * @apiError {Object} 400 Bad Request - Invalid input
 * @apiError {Object} 401 Unauthorized - Not authenticated
 * @apiError {Object} 403 Forbidden - Not authorized as admin
 * @apiError {Object} 404 Not Found - Achievement not found
 */
router.put(
  '/:id',
  authenticate,
  authorize(['admin']),
  idParamValidation,
  achievementValidation,
  validationErrorHandler,
  achievementController.updateAchievement,
);

/**
 * @api {delete} /api/achievements/:id Delete achievement
 * @apiName DeleteAchievement
 * @apiGroup Achievements
 *
 * @apiHeader {String} Authorization Bearer token
 * @apiParam {Number} id Achievement ID
 *
 * @apiSuccess {String} message Success message
 *
 * @apiError {Object} 401 Unauthorized - Not authenticated
 * @apiError {Object} 403 Forbidden - Not authorized as admin
 * @apiError {Object} 404 Not Found - Achievement not found
 */
router.delete(
  '/:id',
  authenticate,
  authorize(['admin']),
  idParamValidation,
  validationErrorHandler,
  achievementController.deleteAchievement,
);

export default router;
