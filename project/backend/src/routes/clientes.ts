import { Router } from 'express';
import { body, validationResult } from 'express-validator';
import { Cliente } from '../models/Cliente';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// Middleware de autenticación para todas las rutas
router.use(authenticateToken);

// Obtener todos los clientes
router.get('/', async (req, res) => {
  try {
    const clientes = await Cliente.findAll({
      where: { activo: true },
      order: [['nombre', 'ASC']],
    });
    res.json(clientes);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener clientes' });
  }
});

// Obtener cliente por ID
router.get('/:id', async (req, res) => {
  try {
    const cliente = await Cliente.findByPk(req.params.id);
    if (!cliente) {
      return res.status(404).json({ message: 'Cliente no encontrado' });
    }
    res.json(cliente);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener cliente' });
  }
});

// Crear cliente
router.post('/', [
  body('nombre').notEmpty().withMessage('Nombre requerido'),
  body('email').optional().isEmail().withMessage('Email inválido'),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const cliente = await Cliente.create(req.body);
    res.status(201).json(cliente);
  } catch (error) {
    res.status(500).json({ message: 'Error al crear cliente' });
  }
});

// Actualizar cliente
router.put('/:id', [
  body('nombre').optional().notEmpty().withMessage('Nombre no puede estar vacío'),
  body('email').optional().isEmail().withMessage('Email inválido'),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const [updated] = await Cliente.update(req.body, {
      where: { id: req.params.id },
    });

    if (updated === 0) {
      return res.status(404).json({ message: 'Cliente no encontrado' });
    }

    const cliente = await Cliente.findByPk(req.params.id);
    res.json(cliente);
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar cliente' });
  }
});

// Eliminar cliente (soft delete)
router.delete('/:id', async (req, res) => {
  try {
    const [updated] = await Cliente.update(
      { activo: false },
      { where: { id: req.params.id } }
    );

    if (updated === 0) {
      return res.status(404).json({ message: 'Cliente no encontrado' });
    }

    res.json({ message: 'Cliente eliminado' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar cliente' });
  }
});

export default router;