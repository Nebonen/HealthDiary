import {body} from 'express-validator';

// Validation for user registration
export const registerValidation = [
  body('username')
    .trim()
    .notEmpty()
    .withMessage('Username is required')
    .isLength({min: 3})
    .withMessage('Username must be at least 3 characters long')
    .isLength({max: 50})
    .withMessage('Username cannot exceed 50 characters'),

  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Must be a valid email address')
    .normalizeEmail(),

  body('password')
    .trim()
    .notEmpty()
    .withMessage('Password is required')
    .isLength({min: 8})
    .withMessage('Password must be at least 8 characters long'),
];

// Validation for user login
export const loginValidation = [
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Must be a valid email address')
    .normalizeEmail(),

  body('password').trim().notEmpty().withMessage('Password is required'),
];
