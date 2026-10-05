import { Request, Response, NextFunction } from 'express';
import { config } from '../config/index.js';
import { ApiResponse } from '../types/index.js';

export interface AppError extends Error {
  statusCode?: number;
}

export const errorHandler = (
  err: AppError,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void => {
  const statusCode = err.statusCode ?? 500;
  const body: ApiResponse = {
    success: false,
    error: statusCode >= 500 ? 'Internal Server Error' : err.message,
    ...(config.env !== 'production' && { message: err.message }),
  };

  if (statusCode >= 500) {
    console.error('[error]', err);
  }

  res.status(statusCode).json(body);
};
