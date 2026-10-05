import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../config/database.js';

export type UserRole = 'EMPLOYEE' | 'ADMIN';

export interface UserAttributes {
  id: string;
  fullName: string;
  email: string;
  passwordHash: string;
  role: UserRole;
  createdAt?: Date;
  updatedAt?: Date;
}

type UserCreationAttributes = Optional<UserAttributes, 'id' | 'role'>;

export class User
  extends Model<UserAttributes, UserCreationAttributes>
  implements UserAttributes
{
  declare id: string;
  declare fullName: string;
  declare email: string;
  declare passwordHash: string;
  declare role: UserRole;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

User.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    fullName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    passwordHash: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM('EMPLOYEE', 'ADMIN'),
      allowNull: false,
      defaultValue: 'EMPLOYEE',
    },
  },
  {
    sequelize,
    tableName: 'Users',
    modelName: 'User',
  },
);

export default User;
