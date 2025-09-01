import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit, Trash2, User } from 'lucide-react';
import { clientesService, Cliente } from '../services/clientesService';
import ClientForm from '../components/ClientForm';
import toast from 'react-hot-toast';

const Clientes: React.FC = () => {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingClient, setEditingClient] = useState<Cliente | null>(null);

  useEffect(() => {
    loadClientes();
  }, []);

  const loadClientes = async () => {
    try {
      const data = await clientesService.getAll();
      setClientes(data);
    } catch (error) {
      toast.error('Error al cargar clientes');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (cliente: Cliente) => {
    setEditingClient(cliente);
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este cliente?')) {
      try {
        await clientesService.delete(id);
        toast.success('Cliente eliminado');
        loadClientes();
      } catch (error) {
        toast.error('Error al eliminar cliente');
      }
    }
  };

  const filteredClientes = clientes.filter(cliente =>
    cliente.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (cliente.email && cliente.email.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Clientes</h1>
          <p className="text-gray-600 mt-2">Gestiona la base de datos de clientes</p>
        </div>
        <button
          onClick={() => {
            setEditingClient(null);
            setShowForm(true);
          }}
          className="btn-primary flex items-center space-x-2"
        >
          <Plus className="h-5 w-5" />
          <span>Nuevo Cliente</span>
        </button>
      </div>

      {/* Barra de búsqueda */}
      <div className="card p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar clientes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input-field pl-10"
          />
        </div>
      </div>

      {/* Lista de clientes */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredClientes.map((cliente) => (
          <div key={cliente.id} className="card p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-primary-50 rounded-full">
                  <User className="h-5 w-5 text-primary-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900">{cliente.nombre}</h3>
                  {cliente.email && (
                    <p className="text-sm text-gray-600">{cliente.email}</p>
                  )}
                  {cliente.telefono && (
                    <p className="text-sm text-gray-600">{cliente.telefono}</p>
                  )}
                  {cliente.direccion && (
                    <p className="text-sm text-gray-500 mt-1">{cliente.direccion}</p>
                  )}
                </div>
              </div>
              <div className="flex items-center space-x-1">
                <button
                  onClick={() => handleEdit(cliente)}
                  className="text-primary-600 hover:text-primary-900 p-1 rounded-md hover:bg-primary-50"
                >
                  <Edit className="h-4 w-4" />
                </button>
                <button
                  onClick={() => cliente.id && handleDelete(cliente.id)}
                  className="text-red-600 hover:text-red-900 p-1 rounded-md hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredClientes.length === 0 && (
        <div className="text-center py-12">
          <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">No se encontraron clientes</p>
        </div>
      )}

      {/* Modal del formulario */}
      {showForm && (
        <ClientForm
          cliente={editingClient}
          onSave={() => {
            setShowForm(false);
            setEditingClient(null);
            loadClientes();
          }}
          onCancel={() => {
            setShowForm(false);
            setEditingClient(null);
          }}
        />
      )}
    </div>
  );
};

export default Clientes;