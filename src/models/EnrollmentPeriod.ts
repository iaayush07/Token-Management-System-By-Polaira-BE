import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../config/database.js';

export interface EnrollmentPeriodAttributes {
  id: string;
  year: number;
  month: number;
  isOpen: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

type EnrollmentPeriodCreationAttributes = Optional<EnrollmentPeriodAttributes, 'id' | 'isOpen'>;

export class EnrollmentPeriod
  extends Model<EnrollmentPeriodAttributes, EnrollmentPeriodCreationAttributes>
  implements EnrollmentPeriodAttributes
{
  declare id: string;
  declare year: number;
  declare month: number;
  declare isOpen: boolean;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

EnrollmentPeriod.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    year: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    month: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    isOpen: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  },
  {
    sequelize,
    tableName: 'EnrollmentPeriods',
    modelName: 'EnrollmentPeriod',
    indexes: [{ unique: true, fields: ['year', 'month'] }],
  },
);

export default EnrollmentPeriod;
