import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import { signupUser, loginUser, getMeUser } from '../services/authService.js';
import { UserRole } from '../models/User.js';
import { ApiResponse } from '../types/index.js';

export async function signup(req: Request, res: Response, next: NextFunction): Promise<void> {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const body: ApiResponse = {
      success: false,
      error: 'Validation failed',
      message: errors
        .array()
        .map((e) => String(e.msg))
        .join(', '),
    };
    res.status(400).json(body);
    return;
  }

  try {
    const { fullName, email, password, role } = req.body as {
      fullName: string;
      email: string;
      password: string;
      role?: string;
    };

    const user = await signupUser({
      fullName,
      email,
      password,
      role: role as UserRole | undefined,
    });

    const body: ApiResponse = {
      success: true,
      data: user,
      message: 'Account created successfully',
    };
    res.status(201).json(body);
  } catch (err) {
    next(err);
  }
}

export async function me(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const userId = req.user!.sub;
    const user = await getMeUser(userId);

    const body: ApiResponse = {
      success: true,
      data: user,
      message: 'Profile retrieved successfully',
    };
    res.status(200).json(body);
  } catch (err) {
    next(err);
  }
}

export async function login(req: Request, res: Response, next: NextFunction): Promise<void> {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const body: ApiResponse = {
      success: false,
      error: 'Validation failed',
      message: errors
        .array()
        .map((e) => String(e.msg))
        .join(', '),
    };
    res.status(400).json(body);
    return;
  }

  try {
    const { email, password } = req.body as { email: string; password: string };
    const result = await loginUser({ email, password });

    const body: ApiResponse = {
      success: true,
      data: result,
      message: 'Login successful',
    };
    res.status(200).json(body);
  } catch (err) {
    next(err);
  }
}
