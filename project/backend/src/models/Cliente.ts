import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/database';

export interface ClienteAttributes {
  id?: number;
  nombre: string;
  telefono?: string;
  direccion?: string;
  email?: string;
  rfc?: string;
  activo?: boolean;
  created_at?: Date;
  updated_at?: Date;
}

export class Cliente extends Model<ClienteAttributes> implements ClienteAttributes {
  public id!: number;
  public nombre!: string;
  public telefono?: string;
  public direccion?: string;
  public email?: string;
  public rfc?: string;
  public activo!: boolean;
  public readonly created_at!: Date;
  public readonly updated_at!: Date;
}

Cliente.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  nombre: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  telefono: {
    type: DataTypes.STRING(20),
    allowNull: true,
  },
  direccion: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  email: {
    type: DataTypes.STRING(100),
    allowNull: true,
    validate: {
      isEmail: true,
    },
  },
  rfc: {
    type: DataTypes.STRING(20),
    allowNull: true,
  },
  activo: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
}, {
  sequelize,
  tableName: 'clientes',
  timestamps: true,
  underscored: true,
});