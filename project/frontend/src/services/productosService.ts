import api from './api';

export interface Producto {
  id?: number;
  nombre: string;
  descripcion?: string;
  precio: number;
  stock: number;
  categoria: string;
  codigo_barras?: string;
  activo?: boolean;
}

export const productosService = {
  async getAll(): Promise<Producto[]> {
    const response = await api.get('/productos');
    return response.data;
  },

  async getById(id: number): Promise<Producto> {
    const response = await api.get(`/productos/${id}`);
    return response.data;
  },

  async create(producto: Producto): Promise<Producto> {
    const response = await api.post('/productos', producto);
    return response.data;
  },

  async update(id: number, producto: Partial<Producto>): Promise<Producto> {
    const response = await api.put(`/productos/${id}`, producto);
    return response.data;
  },

  async delete(id: number): Promise<void> {
    await api.delete(`/productos/${id}`);
  },
};