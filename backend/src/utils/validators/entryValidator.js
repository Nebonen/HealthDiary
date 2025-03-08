import {body, param} from 'express-validator';

// Validation for creating/updating a diary entry
export const entryValidation = [
  body('date')
    .trim()
    .notEmpty()
    .withMessage('Date is required')
    .isDate()
    .withMessage('Invalid date format'),

  body('mood')
    .trim()
    .notEmpty()
    .withMessage('Mood is required')
    .isIn(['great', 'good', 'neutral', 'meh', 'bad'])
    .withMessage('Invalid mood value'),

  body('weight')
    .optional({nullable: true})
    .isFloat({min: 0, max: 500})
    .withMessage('Weight must be a number between 0 and 500'),

  body('sleep')
    .optional({nullable: true})
    .isFloat({min: 0, max: 24})
    .withMessage('Sleep hours must be a number between 0 and 24'),

  body('notes')
    .optional()
    .isString()
    .withMessage('Notes must be text')
    .isLength({max: 2000})
    .withMessage('Notes cannot exceed 2000 characters'),
];

// Validation for ID parameter
export const idParamValidation = [
  param('id').isInt({min: 1}).withMessage('ID must be a positive integer'),
];
