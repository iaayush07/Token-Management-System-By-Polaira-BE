import { Sequelize } from 'sequelize';
import { config } from './index.js';

export const sequelize = new Sequelize(config.databaseUrl, {
  dialect: 'postgres',
  logging: false,
});
