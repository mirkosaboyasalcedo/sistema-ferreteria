# Ferretería El Tornillo de Oro - Sistema de Ventas

Sistema completo de gestión de ventas para ferretería desarrollado con tecnologías modernas.

## 🛠️ Tecnologías Utilizadas

### Frontend
- **React 19** con TypeScript
- **Tailwind CSS** para estilos
- **React Router DOM** para navegación
- **React Hook Form** para formularios
- **Axios** para consumo de API
- **React Hot Toast** para notificaciones

### Backend
- **Node.js** con Express y TypeScript
- **Sequelize ORM** para base de datos
- **JWT** para autenticación
- **bcryptjs** para hash de contraseñas
- **Express Validator** para validaciones

### Base de Datos
- **MySQL 8.0**
- Esquema relacional optimizado
- Integridad referencial

### DevOps
- **Docker** y **Docker Compose**
- Configuración de desarrollo y producción
- Variables de entorno seguras

## 🏗️ Arquitectura del Sistema

```
ferreteria-el-tornillo-de-oro/
├── frontend/                 # Aplicación React
│   ├── src/
│   │   ├── components/      # Componentes reutilizables
│   │   ├── pages/          # Páginas principales
│   │   ├── services/       # Servicios API
│   │   ├── context/        # Context API
│   │   └── ...
│   ├── Dockerfile
│   └── package.json
├── backend/                  # API Node.js
│   ├── src/
│   │   ├── config/         # Configuración
│   │   ├── models/         # Modelos Sequelize
│   │   ├── routes/         # Rutas API
│   │   ├── middleware/     # Middleware
│   │   └── server.ts
│   ├── Dockerfile
│   └── package.json
├── database/
│   └── init.sql            # Script de inicialización
└── docker-compose.yml      # Orquestación de contenedores
```

## 🚀 Instalación y Ejecución

### Requisitos Previos
- Docker y Docker Compose
- Node.js 18+ (para desarrollo local)
- MySQL 8.0 (para desarrollo local)

### Opción 1: Con Docker (Recomendado)

1. **Clonar el repositorio**
   ```bash
   git clone <url-del-repositorio>
   cd ferreteria-el-tornillo-de-oro
   ```

2. **Ejecutar con Docker Compose**
   ```bash
   docker-compose up -d --build
   ```

3. **Acceder a la aplicación**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:4000
   - Base de datos: localhost:3306

### Opción 2: Desarrollo Local

1. **Configurar la base de datos**
   ```bash
   # Crear base de datos MySQL
   mysql -u root -p -e "CREATE DATABASE ferreteria_db;"
   mysql -u root -p ferreteria_db < database/init.sql
   ```

2. **Backend**
   ```bash
   cd backend
   npm install
   cp .env.example .env
   # Editar .env con tus credenciales
   npm run dev
   ```

3. **Frontend**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

## 👤 Credenciales por Defecto

- **Email:** admin@ferreteria.com
- **Contraseña:** admin123

## 📋 Funcionalidades

### Gestión de Productos
- ✅ Crear, listar, editar y eliminar productos
- ✅ Categorización de productos
- ✅ Control de stock
- ✅ Códigos de barras
- ✅ Búsqueda y filtros

### Gestión de Clientes
- ✅ Registro de clientes
- ✅ Información de contacto completa
- ✅ Búsqueda de clientes
- ✅ Soft delete

### Sistema de Ventas
- ✅ Carrito de compras
- ✅ Múltiples métodos de pago
- ✅ Facturación automática
- ✅ Control de stock en tiempo real
- ✅ Cancelación de ventas
- ✅ Historial completo

### Panel Administrativo
- ✅ Dashboard con estadísticas
- ✅ Reportes de ventas
- ✅ Alertas de stock bajo
- ✅ Gestión de usuarios

### Seguridad
- ✅ Autenticación JWT
- ✅ Hash de contraseñas
- ✅ Rate limiting
- ✅ Validación de datos
- ✅ Manejo de errores

## 🔧 Configuración

### Variables de Entorno

**Backend (.env)**
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=123456
DB_NAME=ferreteria_db
JWT_SECRET=ferreteria_jwt_secret_key_2024
NODE_ENV=development
PORT=4000
```

**Frontend**
```env
VITE_API_URL=http://localhost:4000/api
```

## 📊 Esquema de Base de Datos

### Tablas Principales

1. **usuarios**: Administradores y vendedores
2. **productos**: Inventario de la ferretería
3. **clientes**: Base de datos de clientes
4. **ventas**: Registro de transacciones
5. **detalle_ventas**: Items individuales por venta

### Relaciones
- Ventas → Cliente (N:1)
- Ventas → Usuario (N:1)
- DetalleVenta → Venta (N:1)
- DetalleVenta → Producto (N:1)

## 🔄 API Endpoints

### Autenticación
- `POST /api/auth/login` - Iniciar sesión
- `GET /api/auth/me` - Obtener usuario actual

### Productos
- `GET /api/productos` - Listar productos
- `POST /api/productos` - Crear producto
- `PUT /api/productos/:id` - Actualizar producto
- `DELETE /api/productos/:id` - Eliminar producto

### Clientes
- `GET /api/clientes` - Listar clientes
- `POST /api/clientes` - Crear cliente
- `PUT /api/clientes/:id` - Actualizar cliente
- `DELETE /api/clientes/:id` - Eliminar cliente

### Ventas
- `GET /api/ventas` - Listar ventas
- `POST /api/ventas` - Crear venta
- `GET /api/ventas/:id` - Obtener venta
- `PATCH /api/ventas/:id/cancel` - Cancelar venta

## 🚀 Despliegue en Producción

El sistema está listo para producción con:

- Contenedores Docker optimizados
- Variables de entorno configurables
- Healthchecks automáticos
- Logs estructurados
- Manejo de errores robusto

## 📈 Próximas Funcionalidades

- Reportes avanzados y gráficos
- Sistema de proveedores
- Códigos QR para productos
- Aplicación móvil
- Integración con sistemas de facturación
- Dashboard en tiempo real

## 🤝 Contribución

Este sistema está diseñado para ser escalable y fácil de mantener. Para contribuir:

1. Fork el repositorio
2. Crear rama feature
3. Commit cambios
4. Push a la rama
5. Crear Pull Request

## 📄 Licencia

MIT License - ver archivo LICENSE para detalles.

---

**Ferretería El Tornillo de Oro** - Sistema de Ventas v1.0