import api from './api';

export interface Cliente {
  id?: number;
  nombre: string;
  telefono?: string;
  direccion?: string;
  email?: string;
  rfc?: string;
  activo?: boolean;
}

export const clientesService = {
  async getAll(): Promise<Cliente[]> {
    const response = await api.get('/clientes');
    return response.data;
  },

  async getById(id: number): Promise<Cliente> {
    const response = await api.get(`/clientes/${id}`);
    return response.data;
  },

  async create(cliente: Cliente): Promise<Cliente> {
    const response = await api.post('/clientes', cliente);
    return response.data;
  },

  async update(id: number, cliente: Partial<Cliente>): Promise<Cliente> {
    const response = await api.put(`/clientes/${id}`, cliente);
    return response.data;
  },

  async delete(id: number): Promise<void> {
    await api.delete(`/clientes/${id}`);
  },
};