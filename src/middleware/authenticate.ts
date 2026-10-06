import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config/index.js';
import { AppError } from './error.js';

export interface JwtPayload {
  sub: string;
  email: string;
  role: string;
}

export function authenticate(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers['authorization'];
  const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : undefined;

  if (!token) {
    const err = new Error('Authorization token is required') as AppError;
    err.statusCode = 401;
    next(err);
    return;
  }

  try {
    const payload = jwt.verify(token, config.jwtSecret) as JwtPayload;
    req.user = payload;
    next();
  } catch {
    const err = new Error('Invalid or expired token') as AppError;
    err.statusCode = 401;
    next(err);
  }
}
