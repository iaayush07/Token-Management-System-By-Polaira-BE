import { sequelize } from '../config/database.js';
import User from './User.js';
import Subscription from './Subscription.js';
import QrToken from './QrToken.js';
import EnrollmentPeriod from './EnrollmentPeriod.js';

export { sequelize, User, Subscription, QrToken, EnrollmentPeriod };

export async function initDatabase(): Promise<void> {
  await sequelize.authenticate();
  await User.sync();
  await Subscription.sync({ alter: true });
  await QrToken.sync();
  await EnrollmentPeriod.sync();
}
