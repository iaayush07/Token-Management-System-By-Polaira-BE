import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import { saveSubscription } from '../services/subscriptionService.js';
import { AppError } from '../middleware/error.js';
import { ApiResponse } from '../types/index.js';

function validationError(res: Response, errors: ReturnType<typeof validationResult>): void {
  const body: ApiResponse = {
    success: false,
    error: 'Validation failed',
    message: errors
      .array()
      .map((e) => String(e.msg))
      .join(', '),
  };
  res.status(400).json(body);
}

export async function save(req: Request, res: Response, next: NextFunction): Promise<void> {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    validationError(res, errors);
    return;
  }

  try {
    const { userId, planName = 'LUNCH', status, startDate, endDate = null } = req.body as {
      userId: string;
      planName?: string;
      status: 'ACTIVE' | 'INACTIVE';
      startDate: string;
      endDate?: string | null;
    };

    if (req.user!.sub !== userId) {
      const err = new Error('Access denied') as AppError;
      err.statusCode = 403;
      throw err;
    }

    const result = await saveSubscription(userId, planName, status, startDate, endDate);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
}
