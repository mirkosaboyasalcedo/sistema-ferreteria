import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/database';

export interface UsuarioAttributes {
  id?: number;
  nombre: string;
  email: string;
  password: string;
  rol: 'admin' | 'vendedor';
  created_at?: Date;
  updated_at?: Date;
}

export class Usuario extends Model<UsuarioAttributes> implements UsuarioAttributes {
  public id!: number;
  public nombre!: string;
  public email!: string;
  public password!: string;
  public rol!: 'admin' | 'vendedor';
  public readonly created_at!: Date;
  public readonly updated_at!: Date;
}

Usuario.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  nombre: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
    },
  },
  password: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  rol: {
    type: DataTypes.ENUM('admin', 'vendedor'),
    defaultValue: 'vendedor',
  },
}, {
  sequelize,
  tableName: 'usuarios',
  timestamps: true,
  underscored: true,
});