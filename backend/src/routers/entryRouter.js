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

// CRUD operations for diary entries
router.post(
  '/',
  entryValidation,
  validationErrorHandler,
  entryController.createEntry,
);
router.get('/', entryController.getAllEntries);
router.get(
  '/:id',
  idParamValidation,
  validationErrorHandler,
  entryController.getEntryById,
);
router.put(
  '/:id',
  idParamValidation,
  entryValidation,
  validationErrorHandler,
  entryController.updateEntry,
);
router.delete(
  '/:id',
  idParamValidation,
  validationErrorHandler,
  entryController.deleteEntry,
);

export default router;
