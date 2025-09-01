import { Router } from 'express';
import { body, validationResult } from 'express-validator';
import { Producto } from '../models/Producto';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// Middleware de autenticación para todas las rutas
router.use(authenticateToken);

// Obtener todos los productos
router.get('/', async (req, res) => {
  try {
    const productos = await Producto.findAll({
      where: { activo: true },
      order: [['nombre', 'ASC']],
    });
    res.json(productos);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener productos' });
  }
});

// Obtener producto por ID
router.get('/:id', async (req, res) => {
  try {
    const producto = await Producto.findByPk(req.params.id);
    if (!producto) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }
    res.json(producto);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener producto' });
  }
});

// Crear producto
router.post('/', [
  body('nombre').notEmpty().withMessage('Nombre requerido'),
  body('precio').isNumeric().custom(value => value > 0).withMessage('Precio debe ser mayor a 0'),
  body('stock').isInt({ min: 0 }).withMessage('Stock debe ser un número entero no negativo'),
  body('categoria').notEmpty().withMessage('Categoría requerida'),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const producto = await Producto.create(req.body);
    res.status(201).json(producto);
  } catch (error) {
    res.status(500).json({ message: 'Error al crear producto' });
  }
});

// Actualizar producto
router.put('/:id', [
  body('nombre').optional().notEmpty().withMessage('Nombre no puede estar vacío'),
  body('precio').optional().isNumeric().custom(value => value > 0).withMessage('Precio debe ser mayor a 0'),
  body('stock').optional().isInt({ min: 0 }).withMessage('Stock debe ser un número entero no negativo'),
  body('categoria').optional().notEmpty().withMessage('Categoría no puede estar vacía'),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const [updated] = await Producto.update(req.body, {
      where: { id: req.params.id },
    });

    if (updated === 0) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }

    const producto = await Producto.findByPk(req.params.id);
    res.json(producto);
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar producto' });
  }
});

// Eliminar producto (soft delete)
router.delete('/:id', async (req, res) => {
  try {
    const [updated] = await Producto.update(
      { activo: false },
      { where: { id: req.params.id } }
    );

    if (updated === 0) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }

    res.json({ message: 'Producto eliminado' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar producto' });
  }
});

export default router;