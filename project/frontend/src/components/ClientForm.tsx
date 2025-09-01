import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { X } from 'lucide-react';
import { clientesService, Cliente } from '../services/clientesService';
import toast from 'react-hot-toast';

interface ClientFormProps {
  cliente: Cliente | null;
  onSave: () => void;
  onCancel: () => void;
}

const ClientForm: React.FC<ClientFormProps> = ({ cliente, onSave, onCancel }) => {
  const [isLoading, setIsLoading] = useState(false);
  
  const { register, handleSubmit, formState: { errors }, reset } = useForm<Cliente>({
    defaultValues: cliente || {
      nombre: '',
      telefono: '',
      direccion: '',
      email: '',
      rfc: '',
    }
  });

  useEffect(() => {
    if (cliente) {
      reset(cliente);
    }
  }, [cliente, reset]);

  const onSubmit = async (data: Cliente) => {
    setIsLoading(true);
    try {
      if (cliente?.id) {
        await clientesService.update(cliente.id, data);
        toast.success('Cliente actualizado');
      } else {
        await clientesService.create(data);
        toast.success('Cliente creado');
      }
      onSave();
    } catch (error) {
      toast.error('Error al guardar cliente');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            {cliente ? 'Editar Cliente' : 'Nuevo Cliente'}
          </h2>
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600 p-1 rounded-md hover:bg-gray-100"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nombre *
            </label>
            <input
              {...register('nombre', { required: 'El nombre es requerido' })}
              className="input-field"
              placeholder="Nombre completo"
            />
            {errors.nombre && (
              <p className="text-red-500 text-sm mt-1">{errors.nombre.message}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Teléfono
              </label>
              <input
                {...register('telefono')}
                className="input-field"
                placeholder="555-1234"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                {...register('email')}
                className="input-field"
                placeholder="cliente@email.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Dirección
            </label>
            <textarea
              {...register('direccion')}
              className="input-field"
              rows={3}
              placeholder="Dirección completa"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              RFC
            </label>
            <input
              {...register('rfc')}
              className="input-field"
              placeholder="RFC del cliente"
            />
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

export default ClientForm;