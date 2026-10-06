import { randomUUID } from 'crypto';
import { Transaction } from 'sequelize';
import { sequelize } from '../config/database.js';
import { Subscription } from '../models/Subscription.js';
import { QrToken } from '../models/QrToken.js';
import { AppError } from '../middleware/error.js';

export type TodayTokenStatus = 'valid' | 'expired' | 'none' | 'unsubscribed';

export interface TodayTokenResult {
  status: TodayTokenStatus;
  token?: string;
  expires_at?: string;
}

export interface GenerateTokenResult {
  token: string;
  expires_at: string;
}

function getCurrentMonthStart(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  return `${year}-${month}-01`;
}

function getTodayStr(): string {
  return new Date().toISOString().split('T')[0];
}

async function findActiveSubscription(userId: string): Promise<boolean> {
  const subscription = await Subscription.findOne({
    where: {
      userId,
      planName: 'LUNCH',
      status: 'ACTIVE',
      startDate: getCurrentMonthStart(),
    },
  });
  return subscription !== null;
}

export async function getTodayTokenForUser(userId: string): Promise<TodayTokenResult> {
  const now = new Date();
  const todayStr = getTodayStr();

  const isSubscribed = await findActiveSubscription(userId);
  if (!isSubscribed) {
    return { status: 'unsubscribed' };
  }

  const qrToken = await QrToken.findOne({
    where: { userId, tokenDate: todayStr },
  });

  if (!qrToken) {
    return { status: 'none' };
  }

  if (now >= qrToken.expiresAt) {
    return {
      status: 'expired',
      token: qrToken.token,
      expires_at: qrToken.expiresAt.toISOString(),
    };
  }

  return {
    status: 'valid',
    token: qrToken.token,
    expires_at: qrToken.expiresAt.toISOString(),
  };
}

export async function generateTokenForUser(userId: string): Promise<GenerateTokenResult> {
  const isSubscribed = await findActiveSubscription(userId);
  if (!isSubscribed) {
    const err = new Error('Not subscribed for this month') as AppError;
    err.statusCode = 403;
    throw err;
  }

  const todayStr = getTodayStr();

  const existing = await QrToken.findOne({
    where: { userId, tokenDate: todayStr },
  });

  if (existing) {
    return {
      token: existing.token,
      expires_at: existing.expiresAt.toISOString(),
    };
  }

  const expiresAt = new Date();
  expiresAt.setHours(20, 0, 0, 0);

  const newToken = await QrToken.create({
    token: randomUUID(),
    userId,
    tokenDate: todayStr,
    expiresAt,
  });

  return {
    token: newToken.token,
    expires_at: newToken.expiresAt.toISOString(),
  };
}

export interface ScanTokenResult {
  message: string;
  userId: string;
}

export async function scanToken(token: string): Promise<ScanTokenResult> {
  return sequelize.transaction(async (t) => {
    const qrToken = await QrToken.findOne({
      where: { token },
      lock: Transaction.LOCK.UPDATE,
      transaction: t,
    });

    if (!qrToken) {
      const err = new Error('Token not found') as AppError;
      err.statusCode = 404;
      throw err;
    }

    if (new Date() >= qrToken.expiresAt) {
      const err = new Error('Token has expired') as AppError;
      err.statusCode = 400;
      throw err;
    }

    if (qrToken.used) {
      const err = new Error('Token has already been used') as AppError;
      err.statusCode = 400;
      throw err;
    }

    await qrToken.update({ used: true, usedAt: new Date() }, { transaction: t });

    return { message: 'Token validated successfully', userId: qrToken.userId };
  });
}
