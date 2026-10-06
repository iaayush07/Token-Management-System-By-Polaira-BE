import { randomUUID } from 'crypto';
import { EnrollmentPeriod } from '../models/EnrollmentPeriod.js';
import { Subscription } from '../models/Subscription.js';
import { AppError } from '../middleware/error.js';

export interface SaveSubscriptionResult {
  message: string;
}

export async function saveSubscription(
  userId: string,
  planName: string,
  status: 'ACTIVE' | 'INACTIVE',
  startDate: string,
  endDate: string | null = null,
): Promise<SaveSubscriptionResult> {
  const [yearStr, monthStr] = startDate.split('-');
  const year = parseInt(yearStr, 10);
  const month = parseInt(monthStr, 10);

  const enrollment = await EnrollmentPeriod.findOne({ where: { year, month } });
  if (!enrollment || !enrollment.isOpen) {
    const err = new Error('Enrollment is closed for this month') as AppError;
    err.statusCode = 400;
    throw err;
  }

  const existing = await Subscription.findOne({ where: { userId, startDate } });
  if (existing) {
    await existing.update({ status });
  } else {
    await Subscription.create({
      id: randomUUID(),
      userId,
      planName,
      status,
      startDate,
      endDate,
    });
  }

  return { message: 'Subscription saved successfully' };
}
