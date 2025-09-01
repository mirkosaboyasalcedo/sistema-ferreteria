import bcrypt from 'bcryptjs';
import { sequelize } from './database';
import { Usuario } from '../models/Usuario';
import { Producto } from '../models/Producto';
import { Cliente } from '../models/Cliente';
import { Venta } from '../models/Venta';
import { DetalleVenta } from '../models/DetalleVenta';

export const initializeDatabase = async () => {
  try {
    // Sincronizar modelos con la base de datos
    await sequelize.sync({ alter: true });
    
    // Crear usuario administrador por defecto si no existe
    const adminExists = await Usuario.findOne({ where: { email: 'admin@ferreteria.com' } });
    
    if (!adminExists) {
      const hashedPassword = await bcrypt.hash('admin123', 10);
      await Usuario.create({
        nombre: 'Administrador',
        email: 'admin@ferreteria.com',
        password: hashedPassword,
        rol: 'admin'
      });
      console.log('Usuario administrador creado');
    }

    // Crear productos de ejemplo si no existen
    const productCount = await Producto.count();
    if (productCount === 0) {
      await Producto.bulkCreate([
        {
          nombre: 'Martillo 16oz',
          descripcion: 'Martillo de acero con mango de madera',
          precio: 250.00,
          stock: 15,
          categoria: 'Herramientas',
          codigo_barras: '7501234567890'
        },
        {
          nombre: 'Tornillos Phillips 1/4"',
          descripcion: 'Caja con 100 tornillos Phillips',
          precio: 85.50,
          stock: 50,
          categoria: 'Tornillería',
          codigo_barras: '7501234567891'
        },
        {
          nombre: 'Pintura Blanca 1L',
          descripcion: 'Pintura acrílica blanca para interiores',
          precio: 180.00,
          stock: 25,
          categoria: 'Pinturas',
          codigo_barras: '7501234567892'
        },
        {
          nombre: 'Cable Eléctrico 12AWG',
          descripcion: 'Cable eléctrico calibre 12 por metro',
          precio: 25.00,
          stock: 100,
          categoria: 'Eléctrico',
          codigo_barras: '7501234567893'
        },
        {
          nombre: 'Llave Inglesa 10"',
          descripcion: 'Llave inglesa ajustable de 10 pulgadas',
          precio: 320.00,
          stock: 8,
          categoria: 'Herramientas',
          codigo_barras: '7501234567894'
        }
      ]);
      console.log('Productos de ejemplo creados');
    }

    // Crear clientes de ejemplo si no existen
    const clientCount = await Cliente.count();
    if (clientCount === 0) {
      await Cliente.bulkCreate([
        {
          nombre: 'Juan Pérez',
          telefono: '555-1234',
          direccion: 'Calle Principal 123',
          email: 'juan@email.com'
        },
        {
          nombre: 'María González',
          telefono: '555-5678',
          direccion: 'Av. Central 456',
          email: 'maria@email.com'
        },
        {
          nombre: 'Carlos López',
          telefono: '555-9012',
          direccion: 'Colonia Centro 789',
          email: 'carlos@email.com'
        }
      ]);
      console.log('Clientes de ejemplo creados');
    }

  } catch (error) {
    console.error('Error al inicializar la base de datos:', error);
    throw error;
  }
};