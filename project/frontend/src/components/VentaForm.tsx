import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { X, Plus, Minus, ShoppingCart } from 'lucide-react';
import { ventasService, CrearVenta } from '../services/ventasService';
import { productosService, Producto } from '../services/productosService';
import { clientesService, Cliente } from '../services/clientesService';
import toast from 'react-hot-toast';

interface VentaFormProps {
  onSave: () => void;
  onCancel: () => void;
}

interface ItemVenta {
  producto_id: number;
  producto: Producto;
  cantidad: number;
  precio_unitario: number;
}

const VentaForm: React.FC<VentaFormProps> = ({ onSave, onCancel }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [productos, setProductos] = useState<Producto[]>([]);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [items, setItems] = useState<ItemVenta[]>([]);
  const [selectedProductId, setSelectedProductId] = useState<number>(0);

  const { register, handleSubmit, formState: { errors } } = useForm<{
    cliente_id: number;
    metodo_pago: 'efectivo' | 'tarjeta' | 'transferencia';
  }>();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [productosData, clientesData] = await Promise.all([
        productosService.getAll(),
        clientesService.getAll()
      ]);
      setProductos(productosData.filter(p => p.activo && p.stock > 0));
      setClientes(clientesData.filter(c => c.activo));
    } catch (error) {
      toast.error('Error al cargar datos');
    }
  };

  const addItem = () => {
    const producto = productos.find(p => p.id === selectedProductId);
    if (!producto) return;

    const existingItem = items.find(item => item.producto_id === selectedProductId);
    if (existingItem) {
      if (existingItem.cantidad >= producto.stock) {
        toast.error('No hay suficiente stock');
        return;
      }
      setItems(items.map(item =>
        item.producto_id === selectedProductId
          ? { ...item, cantidad: item.cantidad + 1 }
          : item
      ));
    } else {
      setItems([...items, {
        producto_id: producto.id!,
        producto,
        cantidad: 1,
        precio_unitario: producto.precio,
      }]);
    }
    setSelectedProductId(0);
  };

  const updateQuantity = (productId: number, newQuantity: number) => {
    if (newQuantity <= 0) {
      setItems(items.filter(item => item.producto_id !== productId));
    } else {
      setItems(items.map(item =>
        item.producto_id === productId
          ? { ...item, cantidad: newQuantity }
          : item
      ));
    }
  };

  const total = items.reduce((sum, item) => sum + (item.cantidad * item.precio_unitario), 0);

  const onSubmit = async (data: any) => {
    if (items.length === 0) {
      toast.error('Agrega al menos un producto');
      return;
    }

    setIsLoading(true);
    try {
      const ventaData: CrearVenta = {
        cliente_id: data.cliente_id || undefined,
        metodo_pago: data.metodo_pago,
        items: items.map(item => ({
          producto_id: item.producto_id,
          cantidad: item.cantidad,
          precio_unitario: item.precio_unitario,
        })),
      };

      await ventasService.create(ventaData);
      toast.success('Venta registrada');
      onSave();
    } catch (error) {
      toast.error('Error al registrar venta');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Nueva Venta</h2>
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600 p-1 rounded-md hover:bg-gray-100"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Información de la venta */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cliente (opcional)
              </label>
              <select {...register('cliente_id')} className="input-field">
                <option value="">Cliente General</option>
                {clientes.map(cliente => (
                  <option key={cliente.id} value={cliente.id}>
                    {cliente.nombre}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Método de Pago *
              </label>
              <select
                {...register('metodo_pago', { required: 'El método de pago es requerido' })}
                className="input-field"
              >
                <option value="">Seleccionar método</option>
                <option value="efectivo">Efectivo</option>
                <option value="tarjeta">Tarjeta</option>
                <option value="transferencia">Transferencia</option>
              </select>
              {errors.metodo_pago && (
                <p className="text-red-500 text-sm mt-1">{errors.metodo_pago.message}</p>
              )}
            </div>
          </div>

          {/* Agregar productos */}
          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Productos</h3>
            
            <div className="flex items-center space-x-3 mb-4">
              <select
                value={selectedProductId}
                onChange={(e) => setSelectedProductId(Number(e.target.value))}
                className="input-field flex-1"
              >
                <option value={0}>Seleccionar producto</option>
                {productos.map(producto => (
                  <option key={producto.id} value={producto.id}>
                    {producto.nombre} - ${producto.precio} (Stock: {producto.stock})
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={addItem}
                disabled={!selectedProductId}
                className="btn-primary disabled:opacity-50"
              >
                <Plus className="h-5 w-5" />
              </button>
            </div>

            {/* Lista de items */}
            {items.length > 0 && (
              <div className="space-y-2">
                {items.map((item) => (
                  <div key={item.producto_id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{item.producto.nombre}</p>
                      <p className="text-sm text-gray-500">${item.precio_unitario.toFixed(2)} c/u</p>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center space-x-2">
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.producto_id, item.cantidad - 1)}
                          className="p-1 text-gray-500 hover:text-gray-700 rounded-md hover:bg-gray-200"
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        <span className="w-8 text-center font-medium">{item.cantidad}</span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.producto_id, item.cantidad + 1)}
                          disabled={item.cantidad >= item.producto.stock}
                          className="p-1 text-gray-500 hover:text-gray-700 rounded-md hover:bg-gray-200 disabled:opacity-50"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>
                      
                      <div className="text-right">
                        <p className="font-medium text-gray-900">
                          ${(item.cantidad * item.precio_unitario).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
                
                <div className="border-t pt-3 mt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold text-gray-900">Total:</span>
                    <span className="text-2xl font-bold text-primary-600">${total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-end space-x-3 pt-6 border-t">
            <button type="button" onClick={onCancel} className="btn-secondary">
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isLoading || items.length === 0}
              className="btn-primary disabled:opacity-50 flex items-center space-x-2"
            >
              <ShoppingCart className="h-5 w-5" />
              <span>{isLoading ? 'Procesando...' : 'Registrar Venta'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default VentaForm;