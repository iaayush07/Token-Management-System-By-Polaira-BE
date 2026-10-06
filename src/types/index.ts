import { Request, Response, NextFunction } from 'express';
import { JwtPayload } from '../middleware/authenticate.js';

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export type AsyncRequestHandler = (
  req: Request,
  res: Response,
  next: NextFunction,
) => Promise<void>;

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}
