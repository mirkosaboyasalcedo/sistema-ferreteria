-- Ferretería El Tornillo de Oro - Base de Datos
-- Esquema inicial para sistema de ventas

-- Tabla de usuarios (administradores)
CREATE TABLE IF NOT EXISTS usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    rol ENUM('admin', 'vendedor') DEFAULT 'vendedor',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabla de productos
CREATE TABLE IF NOT EXISTS productos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(200) NOT NULL,
    descripcion TEXT,
    precio DECIMAL(10,2) NOT NULL,
    stock INT NOT NULL DEFAULT 0,
    categoria VARCHAR(100) NOT NULL,
    codigo_barras VARCHAR(50) UNIQUE,
    activo BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabla de clientes
CREATE TABLE IF NOT EXISTS clientes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    telefono VARCHAR(20),
    direccion TEXT,
    email VARCHAR(100),
    rfc VARCHAR(20),
    activo BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabla de ventas
CREATE TABLE IF NOT EXISTS ventas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    total DECIMAL(10,2) NOT NULL,
    cliente_id INT,
    usuario_id INT NOT NULL,
    estado ENUM('pendiente', 'completada', 'cancelada') DEFAULT 'completada',
    metodo_pago ENUM('efectivo', 'tarjeta', 'transferencia') DEFAULT 'efectivo',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (cliente_id) REFERENCES clientes(id) ON DELETE SET NULL,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE RESTRICT
);

-- Tabla de detalle de ventas
CREATE TABLE IF NOT EXISTS detalle_ventas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    venta_id INT NOT NULL,
    producto_id INT NOT NULL,
    cantidad INT NOT NULL,
    precio_unitario DECIMAL(10,2) NOT NULL,
    subtotal DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (venta_id) REFERENCES ventas(id) ON DELETE CASCADE,
    FOREIGN KEY (producto_id) REFERENCES productos(id) ON DELETE RESTRICT
);

-- Insertar usuario administrador por defecto
INSERT INTO usuarios (nombre, email, password, rol) VALUES
('Administrador', 'admin@ferreteria.com', '$2b$10$YourHashedPasswordHere', 'admin');

-- Insertar algunas categorías de productos de ejemplo
INSERT INTO productos (nombre, descripcion, precio, stock, categoria) VALUES
('Martillo 16oz', 'Martillo de acero con mango de madera', 250.00, 15, 'Herramientas'),
('Tornillos Phillips 1/4"', 'Caja con 100 tornillos Phillips', 85.50, 50, 'Tornillería'),
('Pintura Blanca 1L', 'Pintura acrílica blanca para interiores', 180.00, 25, 'Pinturas'),
('Cable Eléctrico 12AWG', 'Cable eléctrico calibre 12 por metro', 25.00, 100, 'Eléctrico'),
('Llave Inglesa 10"', 'Llave inglesa ajustable de 10 pulgadas', 320.00, 8, 'Herramientas');

-- Insertar algunos clientes de ejemplo
INSERT INTO clientes (nombre, telefono, direccion, email) VALUES
('Juan Pérez', '555-1234', 'Calle Principal 123', 'juan@email.com'),
('María González', '555-5678', 'Av. Central 456', 'maria@email.com'),
('Carlos López', '555-9012', 'Colonia Centro 789', 'carlos@email.com');
