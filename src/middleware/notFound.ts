import { Request, Response } from 'express';
import { ApiResponse } from '../types/index.js';

export const notFoundHandler = (_req: Request, res: Response): void => {
  const body: ApiResponse = {
    success: false,
    error: 'Not Found',
    message: `The requested resource does not exist`,
  };
  res.status(404).json(body);
};
