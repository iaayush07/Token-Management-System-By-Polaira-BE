import { body } from 'express-validator';

export const signupValidator = [
  body('fullName')
    .trim()
    .isLength({ min: 2 })
    .withMessage('Full name must be at least 2 characters'),
  body('email').trim().isEmail().withMessage('A valid email address is required'),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters'),
  body('role')
    .optional()
    .isIn(['EMPLOYEE', 'ADMIN'])
    .withMessage('Role must be EMPLOYEE or ADMIN'),
];

export const loginValidator = [
  body('email').trim().isEmail().withMessage('A valid email address is required'),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters'),
];
