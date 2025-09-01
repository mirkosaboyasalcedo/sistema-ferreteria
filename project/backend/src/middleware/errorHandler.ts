import { Request, Response, NextFunction } from 'express';

export const errorHandler = (
  error: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error('Error:', error);

  // Error de validación de Sequelize
  if (error.name === 'SequelizeValidationError') {
    return res.status(400).json({
      message: 'Error de validación',
      errors: error.errors.map((err: any) => ({
        field: err.path,
        message: err.message,
      })),
    });
  }

  // Error de clave duplicada
  if (error.name === 'SequelizeUniqueConstraintError') {
    return res.status(400).json({
      message: 'Ya existe un registro con esos datos',
      field: error.errors[0]?.path,
    });
  }

  // Error de clave foránea
  if (error.name === 'SequelizeForeignKeyConstraintError') {
    return res.status(400).json({
      message: 'Referencia inválida a otro registro',
    });
  }

  // Error de JWT
  if (error.name === 'JsonWebTokenError') {
    return res.status(401).json({
      message: 'Token inválido',
    });
  }

  // Error genérico
  res.status(500).json({
    message: 'Error interno del servidor',
    ...(process.env.NODE_ENV === 'development' && { error: error.message }),
  });
};