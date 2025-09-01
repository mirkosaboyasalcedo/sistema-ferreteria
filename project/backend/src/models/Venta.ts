import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/database';
import { Cliente } from './Cliente';
import { Usuario } from './Usuario';

export interface VentaAttributes {
  id?: number;
  fecha: Date;
  total: number;
  cliente_id?: number;
  usuario_id: number;
  estado: 'pendiente' | 'completada' | 'cancelada';
  metodo_pago: 'efectivo' | 'tarjeta' | 'transferencia';
  created_at?: Date;
  updated_at?: Date;
}

export class Venta extends Model<VentaAttributes> implements VentaAttributes {
  public id!: number;
  public fecha!: Date;
  public total!: number;
  public cliente_id?: number;
  public usuario_id!: number;
  public estado!: 'pendiente' | 'completada' | 'cancelada';
  public metodo_pago!: 'efectivo' | 'tarjeta' | 'transferencia';
  public readonly created_at!: Date;
  public readonly updated_at!: Date;
}

Venta.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  fecha: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  total: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      min: 0,
    },
  },
  cliente_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: Cliente,
      key: 'id',
    },
  },
  usuario_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Usuario,
      key: 'id',
    },
  },
  estado: {
    type: DataTypes.ENUM('pendiente', 'completada', 'cancelada'),
    defaultValue: 'completada',
  },
  metodo_pago: {
    type: DataTypes.ENUM('efectivo', 'tarjeta', 'transferencia'),
    defaultValue: 'efectivo',
  },
}, {
  sequelize,
  tableName: 'ventas',
  timestamps: true,
  underscored: true,
});

// Asociaciones
Venta.belongsTo(Cliente, { foreignKey: 'cliente_id', as: 'cliente' });
Venta.belongsTo(Usuario, { foreignKey: 'usuario_id', as: 'usuario' });