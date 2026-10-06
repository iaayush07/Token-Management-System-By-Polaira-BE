import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../config/database.js';

export type SubscriptionStatus = 'ACTIVE' | 'INACTIVE';

export interface SubscriptionAttributes {
  id: string;
  userId: string;
  planName: string;
  status: SubscriptionStatus;
  startDate: string;
  endDate: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}

type SubscriptionCreationAttributes = Optional<SubscriptionAttributes, 'id' | 'endDate'>;

export class Subscription
  extends Model<SubscriptionAttributes, SubscriptionCreationAttributes>
  implements SubscriptionAttributes
{
  declare id: string;
  declare userId: string;
  declare planName: string;
  declare status: SubscriptionStatus;
  declare startDate: string;
  declare endDate: string | null;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

Subscription.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    planName: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'LUNCH',
    },
    status: {
      type: DataTypes.ENUM('ACTIVE', 'INACTIVE'),
      allowNull: false,
    },
    startDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    endDate: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'Subscriptions',
    modelName: 'Subscription',
    indexes: [{ unique: true, fields: ['userId', 'startDate'] }],
  },
);

export default Subscription;
