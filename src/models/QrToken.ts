import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../config/database.js';

export interface QrTokenAttributes {
  token: string;
  userId: string;
  tokenDate: string;
  used: boolean;
  usedAt: Date | null;
  expiresAt: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

type QrTokenCreationAttributes = Optional<QrTokenAttributes, 'used' | 'usedAt'>;

export class QrToken
  extends Model<QrTokenAttributes, QrTokenCreationAttributes>
  implements QrTokenAttributes
{
  declare token: string;
  declare userId: string;
  declare tokenDate: string;
  declare used: boolean;
  declare usedAt: Date | null;
  declare expiresAt: Date;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

QrToken.init(
  {
    token: {
      type: DataTypes.UUID,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    tokenDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    used: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    usedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    expiresAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'QrTokens',
    modelName: 'QrToken',
  },
);

export default QrToken;
