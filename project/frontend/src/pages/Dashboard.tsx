import React from 'react';
import { Package, Users, ShoppingCart, DollarSign } from 'lucide-react';

interface StatCard {
  title: string;
  value: string;
  icon: React.ComponentType<any>;
  color: string;
}

const Dashboard: React.FC = () => {
  const stats: StatCard[] = [
    {
      title: 'Productos',
      value: '156',
      icon: Package,
      color: 'text-blue-600 bg-blue-50',
    },
    {
      title: 'Clientes',
      value: '89',
      icon: Users,
      color: 'text-green-600 bg-green-50',
    },
    {
      title: 'Ventas Hoy',
      value: '23',
      icon: ShoppingCart,
      color: 'text-purple-600 bg-purple-50',
    },
    {
      title: 'Total Hoy',
      value: '$12,450',
      icon: DollarSign,
      color: 'text-yellow-600 bg-yellow-50',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">Resumen general del sistema</p>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="card p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-full ${stat.color}`}>
                  <Icon className="h-6 w-6" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Actividad reciente */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Ventas Recientes</h3>
          <div className="space-y-3">
            {[1, 2, 3, 4].map((item) => (
              <div key={item} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                <div>
                  <p className="font-medium text-gray-900">Venta #{1000 + item}</p>
                  <p className="text-sm text-gray-500">Juan Pérez</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">${(Math.random() * 1000 + 100).toFixed(2)}</p>
                  <p className="text-xs text-gray-500">Hace {item}h</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Productos con Poco Stock</h3>
          <div className="space-y-3">
            {[
              { nombre: 'Tornillos Phillips 1/4"', stock: 5 },
              { nombre: 'Pintura Blanca 1L', stock: 3 },
              { nombre: 'Cable Eléctrico 12AWG', stock: 8 },
              { nombre: 'Llave Inglesa 10"', stock: 2 },
            ].map((producto, index) => (
              <div key={index} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                <div>
                  <p className="font-medium text-gray-900">{producto.nombre}</p>
                  <p className="text-sm text-gray-500">En stock</p>
                </div>
                <div className="text-right">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    producto.stock <= 5 
                      ? 'bg-red-100 text-red-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {producto.stock} unidades
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;