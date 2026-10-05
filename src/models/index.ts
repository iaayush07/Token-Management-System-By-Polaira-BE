import { sequelize } from '../config/database.js';
import User from './User.js';

export { sequelize, User };

export async function initDatabase(): Promise<void> {
  await sequelize.authenticate();
  await User.sync();
}
