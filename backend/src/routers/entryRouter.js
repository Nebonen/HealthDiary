import express from 'express';
import * as entryController from '../controllers/entryController.js';
import authenticate from '../middlewares/authentication.js';
import {validationErrorHandler} from '../middlewares/errorHandler.js';
import {
  entryValidation,
  idParamValidation,
} from '../utils/validators/entryValidator.js';

const router = express.Router();

// All entry routes require authentication
router.use(authenticate);

/**
 * @api {post} /api/entries Create a new diary entry
 * @apiName CreateEntry
 * @apiGroup Entries
 *
 * @apiHeader {String} Authorization Bearer token
 *
 * @apiBody {String} title Entry title
 * @apiBody {String} content Entry content
 * @apiBody {String} [mood] User's mood
 * @apiBody {String} [category] Entry category
 * @apiBody {Number[]} [metrics] Health metrics
 *
 * @apiSuccess {Object} entry Created diary entry
 * @apiSuccess {Number} entry.entry_id Entry ID
 * @apiSuccess {Number} entry.user_id User ID
 * @apiSuccess {String} entry.title Entry title
 * @apiSuccess {String} entry.content Entry content
 * @apiSuccess {String} entry.mood User mood
 * @apiSuccess {String} entry.category Entry category
 * @apiSuccess {Date} entry.created_at Creation timestamp
 *
 * @apiError {Object} 400 Bad Request - Invalid input data
 * @apiError {Object} 401 Unauthorized - Not authenticated
 */
router.post(
  '/',
  entryValidation,
  validationErrorHandler,
  entryController.createEntry,
);

/**
 * @api {get} /api/entries Get all user entries
 * @apiName GetAllEntries
 * @apiGroup Entries
 *
 * @apiHeader {String} Authorization Bearer token
 * @apiQuery {String} [startDate] Filter by start date (ISO format)
 * @apiQuery {String} [endDate] Filter by end date (ISO format)
 * @apiQuery {String} [category] Filter by category
 * @apiQuery {String} [mood] Filter by mood
 *
 * @apiSuccess {Object[]} entries List of user's diary entries
 *
 * @apiError {Object} 401 Unauthorized - Not authenticated
 */
router.get('/', entryController.getAllEntries);

/**
 * @api {get} /api/entries/:id Get entry by ID
 * @apiName GetEntryById
 * @apiGroup Entries
 *
 * @apiHeader {String} Authorization Bearer token
 * @apiParam {Number} id Entry ID
 *
 * @apiSuccess {Object} entry Requested diary entry
 *
 * @apiError {Object} 401 Unauthorized - Not authenticated
 * @apiError {Object} 403 Forbidden - Entry belongs to another user
 * @apiError {Object} 404 Not Found - Entry not found
 */
router.get(
  '/:id',
  idParamValidation,
  validationErrorHandler,
  entryController.getEntryById,
);

/**
 * @api {put} /api/entries/:id Update entry
 * @apiName UpdateEntry
 * @apiGroup Entries
 *
 * @apiHeader {String} Authorization Bearer token
 * @apiParam {Number} id Entry ID
 *
 * @apiBody {String} [title] Updated title
 * @apiBody {String} [content] Updated content
 * @apiBody {String} [mood] Updated mood
 * @apiBody {String} [category] Updated category
 * @apiBody {Number[]} [metrics] Updated health metrics
 *
 * @apiSuccess {Object} entry Updated diary entry
 *
 * @apiError {Object} 400 Bad Request - Invalid input data
 * @apiError {Object} 401 Unauthorized - Not authenticated
 * @apiError {Object} 403 Forbidden - Entry belongs to another user
 * @apiError {Object} 404 Not Found - Entry not found
 */
router.put(
  '/:id',
  idParamValidation,
  entryValidation,
  validationErrorHandler,
  entryController.updateEntry,
);

/**
 * @api {delete} /api/entries/:id Delete entry
 * @apiName DeleteEntry
 * @apiGroup Entries
 *
 * @apiHeader {String} Authorization Bearer token
 * @apiParam {Number} id Entry ID
 *
 * @apiSuccess {String} message Success message
 *
 * @apiError {Object} 401 Unauthorized - Not authenticated
 * @apiError {Object} 403 Forbidden - Entry belongs to another user
 * @apiError {Object} 404 Not Found - Entry not found
 */
router.delete(
  '/:id',
  idParamValidation,
  validationErrorHandler,
  entryController.deleteEntry,
);

export default router;
