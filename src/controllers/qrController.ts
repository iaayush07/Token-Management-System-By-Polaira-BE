import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import { getTodayTokenForUser, generateTokenForUser, scanToken } from '../services/qrService.js';
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

export async function getToday(req: Request, res: Response, next: NextFunction): Promise<void> {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    validationError(res, errors);
    return;
  }

  try {
    const userId = req.query['userId'] as string;

    if (req.user!.sub !== userId) {
      const err = new Error('Access denied') as AppError;
      err.statusCode = 403;
      throw err;
    }

    const result = await getTodayTokenForUser(userId);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
}

export async function scan(req: Request, res: Response, next: NextFunction): Promise<void> {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    validationError(res, errors);
    return;
  }

  try {
    const { token } = req.body as { token: string };
    const result = await scanToken(token);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
}

export async function generate(req: Request, res: Response, next: NextFunction): Promise<void> {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    validationError(res, errors);
    return;
  }

  try {
    const { userId } = req.body as { userId: string };

    if (req.user!.sub !== userId) {
      const err = new Error('Access denied') as AppError;
      err.statusCode = 403;
      throw err;
    }

    const result = await generateTokenForUser(userId);
    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
}
