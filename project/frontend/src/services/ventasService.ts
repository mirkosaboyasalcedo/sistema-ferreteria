import api from './api';

export interface DetalleVenta {
  id?: number;
  producto_id: number;
  cantidad: number;
  precio_unitario: number;
  subtotal: number;
  producto?: {
    id: number;
    nombre: string;
    precio: number;
  };
}

export interface Venta {
  id?: number;
  fecha: string;
  total: number;
  cliente_id?: number;
  usuario_id: number;
  estado: 'pendiente' | 'completada' | 'cancelada';
  metodo_pago: 'efectivo' | 'tarjeta' | 'transferencia';
  cliente?: {
    id: number;
    nombre: string;
  };
  usuario?: {
    id: number;
    nombre: string;
  };
  detalle_ventas?: DetalleVenta[];
}

export interface CrearVenta {
  cliente_id?: number;
  metodo_pago: 'efectivo' | 'tarjeta' | 'transferencia';
  items: {
    producto_id: number;
    cantidad: number;
    precio_unitario: number;
  }[];
}

export const ventasService = {
  async getAll(): Promise<Venta[]> {
    const response = await api.get('/ventas');
    return response.data;
  },

  async getById(id: number): Promise<Venta> {
    const response = await api.get(`/ventas/${id}`);
    return response.data;
  },

  async create(venta: CrearVenta): Promise<Venta> {
    const response = await api.post('/ventas', venta);
    return response.data;
  },

  async cancel(id: number): Promise<void> {
    await api.patch(`/ventas/${id}/cancel`);
  },
};