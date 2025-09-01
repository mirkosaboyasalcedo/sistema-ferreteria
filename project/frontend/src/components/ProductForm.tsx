import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { X } from 'lucide-react';
import { productosService, Producto } from '../services/productosService';
import toast from 'react-hot-toast';

interface ProductFormProps {
  producto: Producto | null;
  onSave: () => void;
  onCancel: () => void;
}

const ProductForm: React.FC<ProductFormProps> = ({ producto, onSave, onCancel }) => {
  const [isLoading, setIsLoading] = useState(false);
  
  const { register, handleSubmit, formState: { errors }, reset } = useForm<Producto>({
    defaultValues: producto || {
      nombre: '',
      descripcion: '',
      precio: 0,
      stock: 0,
      categoria: '',
      codigo_barras: '',
    }
  });

  useEffect(() => {
    if (producto) {
      reset(producto);
    }
  }, [producto, reset]);

  const onSubmit = async (data: Producto) => {
    setIsLoading(true);
    try {
      if (producto?.id) {
        await productosService.update(producto.id, data);
        toast.success('Producto actualizado');
      } else {
        await productosService.create(data);
        toast.success('Producto creado');
      }
      onSave();
    } catch (error) {
      toast.error('Error al guardar producto');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            {producto ? 'Editar Producto' : 'Nuevo Producto'}
          </h2>
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600 p-1 rounded-md hover:bg-gray-100"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nombre *
              </label>
              <input
                {...register('nombre', { required: 'El nombre es requerido' })}
                className="input-field"
                placeholder="Nombre del producto"
              />
              {errors.nombre && (
                <p className="text-red-500 text-sm mt-1">{errors.nombre.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Categoría *
              </label>
              <select
                {...register('categoria', { required: 'La categoría es requerida' })}
                className="input-field"
              >
                <option value="">Seleccionar categoría</option>
                <option value="Herramientas">Herramientas</option>
                <option value="Tornillería">Tornillería</option>
                <option value="Pinturas">Pinturas</option>
                <option value="Eléctrico">Eléctrico</option>
                <option value="Plomería">Plomería</option>
                <option value="Ferretería General">Ferretería General</option>
              </select>
              {errors.categoria && (
                <p className="text-red-500 text-sm mt-1">{errors.categoria.message}</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Descripción
            </label>
            <textarea
              {...register('descripcion')}
              className="input-field"
              rows={3}
              placeholder="Descripción del producto"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Precio *
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                {...register('precio', { 
                  required: 'El precio es requerido',
                  min: { value: 0, message: 'El precio debe ser mayor a 0' }
                })}
                className="input-field"
                placeholder="0.00"
              />
              {errors.precio && (
                <p className="text-red-500 text-sm mt-1">{errors.precio.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Stock *
              </label>
              <input
                type="number"
                min="0"
                {...register('stock', { 
                  required: 'El stock es requerido',
                  min: { value: 0, message: 'El stock no puede ser negativo' }
                })}
                className="input-field"
                placeholder="0"
              />
              {errors.stock && (
                <p className="text-red-500 text-sm mt-1">{errors.stock.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Código de Barras
              </label>
              <input
                {...register('codigo_barras')}
                className="input-field"
                placeholder="Código de barras"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onCancel}
              className="btn-secondary"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary disabled:opacity-50"
            >
              {isLoading ? 'Guardando...' : 'Guardar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductForm;