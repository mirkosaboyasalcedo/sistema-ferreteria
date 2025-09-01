import React, { useState, useEffect } from 'react';
import { Plus, Search, Eye, X } from 'lucide-react';
import { ventasService, Venta } from '../services/ventasService';
import VentaForm from '../components/VentaForm';
import VentaDetalle from '../components/VentaDetalle';
import toast from 'react-hot-toast';

const Ventas: React.FC = () => {
  const [ventas, setVentas] = useState<Venta[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [selectedVenta, setSelectedVenta] = useState<Venta | null>(null);

  useEffect(() => {
    loadVentas();
  }, []);

  const loadVentas = async () => {
    try {
      const data = await ventasService.getAll();
      setVentas(data);
    } catch (error) {
      toast.error('Error al cargar ventas');
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewVenta = async (venta: Venta) => {
    try {
      if (venta.id) {
        const ventaCompleta = await ventasService.getById(venta.id);
        setSelectedVenta(ventaCompleta);
      }
    } catch (error) {
      toast.error('Error al cargar detalles de la venta');
    }
  };

  const handleCancelVenta = async (id: number) => {
    if (window.confirm('¿Estás seguro de que quieres cancelar esta venta?')) {
      try {
        await ventasService.cancel(id);
        toast.success('Venta cancelada');
        loadVentas();
      } catch (error) {
        toast.error('Error al cancelar venta');
      }
    }
  };

  const filteredVentas = ventas.filter(venta =>
    venta.cliente?.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    venta.id?.toString().includes(searchTerm)
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
          <h1 className="text-3xl font-bold text-gray-900">Ventas</h1>
          <p className="text-gray-600 mt-2">Gestiona las ventas de la ferretería</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="btn-primary flex items-center space-x-2"
        >
          <Plus className="h-5 w-5" />
          <span>Nueva Venta</span>
        </button>
      </div>

      {/* Barra de búsqueda */}
      <div className="card p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar ventas por cliente o ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input-field pl-10"
          />
        </div>
      </div>

      {/* Lista de ventas */}
      <div className="card">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cliente
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fecha
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredVentas.map((venta) => (
                <tr key={venta.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    #{venta.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {venta.cliente?.nombre || 'Cliente General'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(venta.fecha).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    ${venta.total.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      venta.estado === 'completada' 
                        ? 'bg-green-100 text-green-800'
                        : venta.estado === 'pendiente'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {venta.estado}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleViewVenta(venta)}
                        className="text-primary-600 hover:text-primary-900 p-1 rounded-md hover:bg-primary-50"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      {venta.estado === 'completada' && (
                        <button
                          onClick={() => venta.id && handleCancelVenta(venta.id)}
                          className="text-red-600 hover:text-red-900 p-1 rounded-md hover:bg-red-50"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal del formulario */}
      {showForm && (
        <VentaForm
          onSave={() => {
            setShowForm(false);
            loadVentas();
          }}
          onCancel={() => setShowForm(false)}
        />
      )}

      {/* Modal de detalle */}
      {selectedVenta && (
        <VentaDetalle
          venta={selectedVenta}
          onClose={() => setSelectedVenta(null)}
        />
      )}
    </div>
  );
};

export default Ventas;