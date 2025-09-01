import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/database';

export interface ProductoAttributes {
  id?: number;
  nombre: string;
  descripcion?: string;
  precio: number;
  stock: number;
  categoria: string;
  codigo_barras?: string;
  activo?: boolean;
  created_at?: Date;
  updated_at?: Date;
}

export class Producto extends Model<ProductoAttributes> implements ProductoAttributes {
  public id!: number;
  public nombre!: string;
  public descripcion?: string;
  public precio!: number;
  public stock!: number;
  public categoria!: string;
  public codigo_barras?: string;
  public activo!: boolean;
  public readonly created_at!: Date;
  public readonly updated_at!: Date;
}

Producto.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  nombre: {
    type: DataTypes.STRING(200),
    allowNull: false,
  },
  descripcion: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  precio: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      min: 0,
    },
  },
  stock: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
    validate: {
      min: 0,
    },
  },
  categoria: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  codigo_barras: {
    type: DataTypes.STRING(50),
    allowNull: true,
    unique: true,
  },
  activo: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
}, {
  sequelize,
  tableName: 'productos',
  timestamps: true,
  underscored: true,
});