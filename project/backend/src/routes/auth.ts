import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { body, validationResult } from 'express-validator';
import { Usuario } from '../models/Usuario';
import { authenticateToken, AuthenticatedRequest } from '../middleware/auth';

const router = Router();

// Login
router.post('/login', [
  body('email').isEmail().withMessage('Email inválido'),
  body('password').notEmpty().withMessage('Password requerido'),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    const user = await Usuario.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    const jwtSecret = process.env.JWT_SECRET || 'ferreteria_jwt_secret_key_2024';
    const token = jwt.sign({ userId: user.id }, jwtSecret, { expiresIn: '24h' });

    res.json({
      token,
      user: {
        id: user.id,
        nombre: user.nombre,
        email: user.email,
        rol: user.rol,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

// Obtener usuario actual
router.get('/me', authenticateToken, async (req: AuthenticatedRequest, res) => {
  try {
    res.json(req.user);
  } catch (error) {
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

export default router;