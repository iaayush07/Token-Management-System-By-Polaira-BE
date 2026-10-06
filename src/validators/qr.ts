import { query, body } from 'express-validator';

export const todayQueryValidator = [
  query('userId')
    .notEmpty()
    .withMessage('userId query parameter is required'),
];

export const generateBodyValidator = [
  body('userId')
    .notEmpty()
    .withMessage('userId is required'),
];

export const scanBodyValidator = [
  body('token')
    .notEmpty()
    .withMessage('token is required')
    .isUUID()
    .withMessage('token must be a valid UUID'),
];
