import {body, param} from 'express-validator';

// Validation for creating/updating an achievement
export const achievementValidation = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required')
    .isLength({max: 100})
    .withMessage('Name cannot exceed 100 characters'),

  body('description')
    .trim()
    .notEmpty()
    .withMessage('Description is required')
    .isLength({max: 255})
    .withMessage('Description cannot exceed 255 characters'),

  body('experience_points')
    .notEmpty()
    .withMessage('Experience points are required')
    .isInt({min: 1})
    .withMessage('Experience points must be a positive number'),

  body('requirement')
    .trim()
    .notEmpty()
    .withMessage('Requirement is required')
    .isLength({max: 255})
    .withMessage('Requirement cannot exceed 255 characters'),
];

// Validation for ID parameter
export const idParamValidation = [
  param('id').isInt({min: 1}).withMessage('ID must be a positive integer'),
];
