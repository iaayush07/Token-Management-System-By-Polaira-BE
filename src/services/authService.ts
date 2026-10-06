import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User, UserRole } from '../models/User.js';
import { AppError } from '../middleware/error.js';
import { config } from '../config/index.js';

export interface SignupInput {
  fullName: string;
  email: string;
  password: string;
  role?: UserRole;
}

export interface SignupResult {
  id: string;
  fullName: string;
  email: string;
  role: UserRole;
}

export async function signupUser(input: SignupInput): Promise<SignupResult> {
  const existing = await User.findOne({ where: { email: input.email } });
  if (existing !== null) {
    const err = new Error('Email already registered') as AppError;
    err.statusCode = 409;
    throw err;
  }

  const passwordHash = await bcrypt.hash(input.password, 12);

  const user = await User.create({
    fullName: input.fullName,
    email: input.email,
    passwordHash,
    role: input.role ?? 'EMPLOYEE',
  });

  return {
    id: user.id,
    fullName: user.fullName,
    email: user.email,
    role: user.role,
  };
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface LoginResult {
  token: string;
}

export async function loginUser(input: LoginInput): Promise<LoginResult> {
  const user = await User.findOne({ where: { email: input.email } });

  const invalidCredentialsError = (): AppError => {
    const err = new Error('Invalid credentials') as AppError;
    err.statusCode = 401;
    return err;
  };

  if (user === null) {
    throw invalidCredentialsError();
  }

  const passwordMatch = await bcrypt.compare(input.password, user.passwordHash);
  if (!passwordMatch) {
    throw invalidCredentialsError();
  }

  const token = jwt.sign(
    { sub: user.id, email: user.email, role: user.role },
    config.jwtSecret,
    { expiresIn: '8h' },
  );

  return { token };
}
