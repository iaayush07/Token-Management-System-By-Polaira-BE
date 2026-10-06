import { body } from 'express-validator';

export const subscriptionBodyValidator = [
  body('userId').notEmpty().withMessage('userId is required'),
  body('status')
    .isIn(['ACTIVE', 'INACTIVE'])
    .withMessage('status must be ACTIVE or INACTIVE'),
  body('startDate')
    .notEmpty()
    .withMessage('startDate is required')
    .isISO8601()
    .withMessage('startDate must be a valid ISO date (e.g. 2026-10-01)'),
];
