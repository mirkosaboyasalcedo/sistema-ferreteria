import { Router } from 'express';
import { body, validationResult } from 'express-validator';
import { sequelize } from '../config/database';
import { Venta } from '../models/Venta';
import { DetalleVenta } from '../models/DetalleVenta';
import { Producto } from '../models/Producto';
import { Cliente } from '../models/Cliente';
import { Usuario } from '../models/Usuario';
import { authenticateToken, AuthenticatedRequest } from '../middleware/auth';

const router = Router();

// Middleware de autenticación para todas las rutas
router.use(authenticateToken);

// Obtener todas las ventas
router.get('/', async (req, res) => {
  try {
    const ventas = await Venta.findAll({
      include: [
        { model: Cliente, as: 'cliente', attributes: ['id', 'nombre'] },
        { model: Usuario, as: 'usuario', attributes: ['id', 'nombre'] },
      ],
      order: [['fecha', 'DESC']],
    });
    res.json(ventas);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener ventas' });
  }
});

// Obtener venta por ID
router.get('/:id', async (req, res) => {
  try {
    const venta = await Venta.findByPk(req.params.id, {
      include: [
        { model: Cliente, as: 'cliente' },
        { model: Usuario, as: 'usuario', attributes: ['id', 'nombre'] },
        {
          model: DetalleVenta,
          as: 'detalle_ventas',
          include: [{ model: Producto, as: 'producto', attributes: ['id', 'nombre'] }],
        },
      ],
    });

    if (!venta) {
      return res.status(404).json({ message: 'Venta no encontrada' });
    }

    res.json(venta);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener venta' });
  }
});

// Crear venta
router.post('/', [
  body('metodo_pago').isIn(['efectivo', 'tarjeta', 'transferencia']).withMessage('Método de pago inválido'),
  body('items').isArray({ min: 1 }).withMessage('Se requiere al menos un producto'),
  body('items.*.producto_id').isInt().withMessage('ID de producto inválido'),
  body('items.*.cantidad').isInt({ min: 1 }).withMessage('Cantidad debe ser mayor a 0'),
  body('items.*.precio_unitario').isNumeric().withMessage('Precio unitario inválido'),
], async (req: AuthenticatedRequest, res) => {
  const transaction = await sequelize.transaction();
  
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      await transaction.rollback();
      return res.status(400).json({ errors: errors.array() });
    }

    const { cliente_id, metodo_pago, items } = req.body;

    // Verificar stock disponible
    for (const item of items) {
      const producto = await Producto.findByPk(item.producto_id);
      if (!producto) {
        await transaction.rollback();
        return res.status(400).json({ message: `Producto ${item.producto_id} no encontrado` });
      }
      if (producto.stock < item.cantidad) {
        await transaction.rollback();
        return res.status(400).json({ 
          message: `Stock insuficiente para ${producto.nombre}. Disponible: ${producto.stock}` 
        });
      }
    }

    // Calcular total
    const total = items.reduce((sum: number, item: any) => 
      sum + (item.cantidad * item.precio_unitario), 0
    );

    // Crear venta
    const venta = await Venta.create({
      fecha: new Date(),
      total,
      cliente_id: cliente_id || null,
      usuario_id: req.user!.id,
      estado: 'completada',
      metodo_pago,
    }, { transaction });

    // Crear detalles de venta y actualizar stock
    for (const item of items) {
      const subtotal = item.cantidad * item.precio_unitario;
      
      await DetalleVenta.create({
        venta_id: venta.id,
        producto_id: item.producto_id,
        cantidad: item.cantidad,
        precio_unitario: item.precio_unitario,
        subtotal,
      }, { transaction });

      // Actualizar stock
      await Producto.update(
        { stock: sequelize.literal(`stock - ${item.cantidad}`) },
        { where: { id: item.producto_id }, transaction }
      );
    }

    await transaction.commit();

    // Obtener venta completa para respuesta
    const ventaCompleta = await Venta.findByPk(venta.id, {
      include: [
        { model: Cliente, as: 'cliente' },
        { model: Usuario, as: 'usuario', attributes: ['id', 'nombre'] },
        {
          model: DetalleVenta,
          as: 'detalle_ventas',
          include: [{ model: Producto, as: 'producto' }],
        },
      ],
    });

    res.status(201).json(ventaCompleta);
  } catch (error) {
    await transaction.rollback();
    res.status(500).json({ message: 'Error al crear venta' });
  }
});

// Cancelar venta
router.patch('/:id/cancel', async (req, res) => {
  const transaction = await sequelize.transaction();
  
  try {
    const venta = await Venta.findByPk(req.params.id, {
      include: [{ model: DetalleVenta, as: 'detalle_ventas' }],
    });

    if (!venta) {
      await transaction.rollback();
      return res.status(404).json({ message: 'Venta no encontrada' });
    }

    if (venta.estado !== 'completada') {
      await transaction.rollback();
      return res.status(400).json({ message: 'Solo se pueden cancelar ventas completadas' });
    }

    // Restaurar stock
    if (venta.detalle_ventas) {
      for (const detalle of venta.detalle_ventas) {
        await Producto.update(
          { stock: sequelize.literal(`stock + ${detalle.cantidad}`) },
          { where: { id: detalle.producto_id }, transaction }
        );
      }
    }

    // Actualizar estado de venta
    await venta.update({ estado: 'cancelada' }, { transaction });

    await transaction.commit();
    res.json({ message: 'Venta cancelada' });
  } catch (error) {
    await transaction.rollback();
    res.status(500).json({ message: 'Error al cancelar venta' });
  }
});

export default router;