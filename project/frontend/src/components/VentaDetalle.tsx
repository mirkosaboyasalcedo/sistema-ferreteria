import React from 'react';
import { X, Calendar, User, CreditCard } from 'lucide-react';
import { Venta } from '../services/ventasService';

interface VentaDetalleProps {
  venta: Venta;
  onClose: () => void;
}

const VentaDetalle: React.FC<VentaDetalleProps> = ({ venta, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            Detalle de Venta #{venta.id}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-1 rounded-md hover:bg-gray-100"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Información de la venta */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="flex items-center space-x-3">
            <Calendar className="h-5 w-5 text-gray-400" />
            <div>
              <p className="text-sm text-gray-500">Fecha</p>
              <p className="font-medium">{new Date(venta.fecha).toLocaleDateString()}</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <User className="h-5 w-5 text-gray-400" />
            <div>
              <p className="text-sm text-gray-500">Cliente</p>
              <p className="font-medium">{venta.cliente?.nombre || 'Cliente General'}</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <CreditCard className="h-5 w-5 text-gray-400" />
            <div>
              <p className="text-sm text-gray-500">Método de Pago</p>
              <p className="font-medium capitalize">{venta.metodo_pago}</p>
            </div>
          </div>
        </div>

        {/* Estado */}
        <div className="mb-6">
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
            venta.estado === 'completada' 
              ? 'bg-green-100 text-green-800'
              : venta.estado === 'pendiente'
              ? 'bg-yellow-100 text-yellow-800'
              : 'bg-red-100 text-red-800'
          }`}>
            {venta.estado.toUpperCase()}
          </span>
        </div>

        {/* Productos */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Productos</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Producto
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Cantidad
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Precio Unit.
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Subtotal
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {venta.detalle_ventas?.map((detalle, index) => (
                  <tr key={index}>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {detalle.producto?.nombre}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {detalle.cantidad}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      ${detalle.precio_unitario.toFixed(2)}
                    </td>
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">
                      ${detalle.subtotal.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Total */}
        <div className="border-t pt-4">
          <div className="flex justify-between items-center">
            <span className="text-xl font-semibold text-gray-900">Total:</span>
            <span className="text-3xl font-bold text-primary-600">${venta.total.toFixed(2)}</span>
          </div>
        </div>

        <div className="flex justify-end pt-6">
          <button onClick={onClose} className="btn-primary">
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default VentaDetalle;