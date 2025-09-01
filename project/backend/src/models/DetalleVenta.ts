import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/database';
import { Venta } from './Venta';
import { Producto } from './Producto';

export interface DetalleVentaAttributes {
  id?: number;
  venta_id: number;
  producto_id: number;
  cantidad: number;
  precio_unitario: number;
  subtotal: number;
  created_at?: Date;
}

export class DetalleVenta extends Model<DetalleVentaAttributes> implements DetalleVentaAttributes {
  public id!: number;
  public venta_id!: number;
  public producto_id!: number;
  public cantidad!: number;
  public precio_unitario!: number;
  public subtotal!: number;
  public readonly created_at!: Date;
}

DetalleVenta.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  venta_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Venta,
      key: 'id',
    },
  },
  producto_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Producto,
      key: 'id',
    },
  },
  cantidad: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1,
    },
  },
  precio_unitario: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      min: 0,
    },
  },
  subtotal: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      min: 0,
    },
  },
}, {
  sequelize,
  tableName: 'detalle_ventas',
  timestamps: true,
  underscored: true,
});

// Asociaciones
DetalleVenta.belongsTo(Venta, { foreignKey: 'venta_id', as: 'venta' });
DetalleVenta.belongsTo(Producto, { foreignKey: 'producto_id', as: 'producto' });

Venta.hasMany(DetalleVenta, { foreignKey: 'venta_id', as: 'detalle_ventas' });