import express from 'express';
import * as adminController from '../controllers/adminController.js';
import authenticate from '../middlewares/authentication.js';
import authorize from '../middlewares/authorization.js';

const router = express.Router();

// All admin routes require authentication and admin authorization
router.use(authenticate);
router.use(authorize(['admin']));

/**
 * @api {get} /api/admin/users Get all users
 * @apiName GetAllUsers
 * @apiGroup Admin
 *
 * @apiHeader {String} Authorization Bearer token
 *
 * @apiSuccess {Object[]} users List of all registered users
 *
 * @apiError {Object} 401 Unauthorized - Not authenticated
 * @apiError {Object} 403 Forbidden - Not authorized as admin
 */
router.get('/users', adminController.getAllUsers);

/**
 * @api {get} /api/admin/users/:id Get user by ID
 * @apiName GetUserById
 * @apiGroup Admin
 *
 * @apiHeader {String} Authorization Bearer token
 * @apiParam {Number} id User ID
 *
 * @apiSuccess {Object} user User information
 *
 * @apiError {Object} 401 Unauthorized - Not authenticated
 * @apiError {Object} 403 Forbidden - Not authorized as admin
 * @apiError {Object} 404 Not Found - User not found
 */
router.get('/users/:id', adminController.getUserById);

/**
 * @api {put} /api/admin/users/:id/level Update user level
 * @apiName UpdateUserLevel
 * @apiGroup Admin
 *
 * @apiHeader {String} Authorization Bearer token
 * @apiParam {Number} id User ID
 * @apiBody {String} userLevel New user level (e.g., "user", "admin")
 *
 * @apiSuccess {String} message Success message
 *
 * @apiError {Object} 401 Unauthorized - Not authenticated
 * @apiError {Object} 403 Forbidden - Not authorized as admin
 * @apiError {Object} 404 Not Found - User not found
 */
router.put('/users/:id/level', adminController.updateUserLevel);

/**
 * @api {delete} /api/admin/users/:id Delete user
 * @apiName DeleteUser
 * @apiGroup Admin
 *
 * @apiHeader {String} Authorization Bearer token
 * @apiParam {Number} id User ID
 *
 * @apiSuccess {String} message Success message
 *
 * @apiError {Object} 401 Unauthorized - Not authenticated
 * @apiError {Object} 403 Forbidden - Not authorized as admin
 * @apiError {Object} 404 Not Found - User not found
 */
router.delete('/users/:id', adminController.deleteUser);

/**
 * @api {get} /api/admin/stats Get system statistics
 * @apiName GetSystemStats
 * @apiGroup Admin
 *
 * @apiHeader {String} Authorization Bearer token
 *
 * @apiSuccess {Object} stats System statistics
 * @apiSuccess {Number} stats.totalUsers Number of registered users
 * @apiSuccess {Number} stats.totalEntries Number of diary entries
 * @apiSuccess {Number} stats.totalAchievements Number of achievements
 *
 * @apiError {Object} 401 Unauthorized - Not authenticated
 * @apiError {Object} 403 Forbidden - Not authorized as admin
 */
router.get('/stats', adminController.getSystemStats);

export default router;
