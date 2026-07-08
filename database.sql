-- BASE DE DATOS DEL PROYECTO POKÉMON CAFÉ
-- Ejecuta este archivo en Aiven / MySQL.

USE defaultdb;

CREATE TABLE IF NOT EXISTS usuarios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  usuario VARCHAR(15) NOT NULL,
  correo VARCHAR(150) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uq_usuarios_correo (correo)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla simplificada de productos.
-- Se quitaron campos visuales innecesarios para la BD: descripcion, img, popular y etiqueta.
-- Las imágenes/descripciones quedan en products-data.json y shop.js.
CREATE TABLE IF NOT EXISTS productos (
  id VARCHAR(80) PRIMARY KEY,
  nombre VARCHAR(150) NOT NULL,
  categoria VARCHAR(60) NOT NULL,
  precio_original DECIMAL(10,2) NOT NULL,
  precio DECIMAL(10,2) NOT NULL,
  stock INT NOT NULL DEFAULT 0,
  oferta TINYINT(1) NOT NULL DEFAULT 0,
  activo TINYINT(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO productos
  (id, nombre, categoria, precio_original, precio, stock, oferta)
VALUES
  ('galletas', 'Galletas Decoradas', 'Postres', 8, 4, 8, 1),
  ('pokebowl', 'Pokebowl', 'Platos', 18, 12, 10, 1),
  ('eeveelution-macarons', 'Eeveelution Macarons', 'Postres', 15, 7.5, 8, 1),
  ('postre-pikachu', 'Postre Pikachu', 'Postres', 10, 7, 8, 1),
  ('pika-cheesecake', 'Pika-Pika Cheesecake', 'Postres', 20, 12, 8, 1),
  ('clefairy-pancakes', 'Clefairy Fluffy Pancakes', 'Postres', 18, 15, 8, 1),
  ('gengar-shadow-brownie', 'Gengar Shadow Brownie', 'Postres', 11, 11, 8, 0),
  ('jynx-sorbet', 'Jynx Frost Sorbet Trio', 'Postres', 10, 10, 8, 0),
  ('magcargo-cake', 'Magcargo Molten Cake', 'Postres', 12, 12, 8, 0),
  ('eevee-pancakes', 'Eevee Pancakes', 'Postres', 15, 15, 8, 0),
  ('pokedonas', 'PokeDonas', 'Postres', 8, 8, 8, 0),
  ('gengar-brownie', 'Gengar Brownie', 'Postres', 11, 11, 8, 0),
  ('pokecupcakes', 'PokéCupcakes', 'Postres', 9, 9, 8, 0),
  ('pikachu-latte', 'Pikachu Latte', 'Bebidas', 12, 12, 10, 0),
  ('charizard-roast', 'Charizard Roast', 'Bebidas', 8, 8, 10, 0),
  ('bulbasaur-matcha', 'Bulbasaur Matcha Latte', 'Bebidas', 10, 10, 10, 0),
  ('glaceon-frappe', 'Glaceon Ice Crystal Frappé', 'Bebidas', 12, 12, 10, 0),
  ('jigglypuff-smoothie', 'Jigglypuff Melody Smoothie', 'Bebidas', 13, 13, 10, 0),
  ('mewtwo-latte', 'Mewtwo Galaxy Latte', 'Bebidas', 14, 14, 10, 0),
  ('snorlax-chocolate', 'Snorlax Comfort Chocolate', 'Bebidas', 16, 16, 10, 0),
  ('squirtle-smoothie', 'Squirtle Smoothie Bowl', 'Bebidas', 15, 15, 10, 0),
  ('arcanine-wings', 'Arcanine Ember Wings', 'Platos', 16, 16, 10, 0),
  ('chansey-custard', 'Chansey Egg Custard', 'Platos', 9, 9, 10, 0),
  ('electrabuzz-chicken', 'Electrabuzz Citrus Chicken', 'Platos', 18, 18, 10, 0),
  ('gardevoir-tartine', 'Gardevoir Royal Tartine', 'Platos', 14, 14, 10, 0),
  ('gyarados-pasta', 'Gyarados Marinara Pasta', 'Platos', 17, 17, 10, 0),
  ('koffing-bites', 'Koffing Crispy Bites', 'Platos', 8, 8, 10, 0),
  ('magnezone-fries', 'Magnezone Spark Fries', 'Platos', 9, 9, 10, 0),
  ('mewtwo-zen', 'Mewtwo Zen Bowl', 'Platos', 13, 13, 10, 0),
  ('onix-burger', 'Onix Rock Burger', 'Platos', 14, 14, 10, 0),
  ('rayquaza-roll', 'Rayquaza Sky Roll', 'Platos', 15, 15, 10, 0),
  ('snorlax-mac', 'Snorlax Comfort Mac & Cheese', 'Platos', 16, 16, 10, 0)
ON DUPLICATE KEY UPDATE
  nombre = VALUES(nombre),
  categoria = VALUES(categoria),
  precio_original = VALUES(precio_original),
  precio = VALUES(precio),
  oferta = VALUES(oferta),
  activo = 1;

CREATE TABLE IF NOT EXISTS pedidos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  usuario_id INT NOT NULL,
  cliente VARCHAR(120) NOT NULL,
  correo VARCHAR(150) NOT NULL,
  telefono VARCHAR(30) NOT NULL,
  direccion VARCHAR(255) NOT NULL,
  metodo_entrega VARCHAR(40) DEFAULT 'delivery',
  metodo_pago VARCHAR(40) DEFAULT 'efectivo',
  notas TEXT,
  subtotal DECIMAL(10,2) NOT NULL DEFAULT 0,
  envio DECIMAL(10,2) NOT NULL DEFAULT 0,
  descuento DECIMAL(10,2) NOT NULL DEFAULT 0,
  total DECIMAL(10,2) NOT NULL DEFAULT 0,
  estado ENUM('Preparando','En proceso','Enviado') NOT NULL DEFAULT 'Preparando',
  creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_pedidos_usuario FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS pedido_detalles (
  id INT AUTO_INCREMENT PRIMARY KEY,
  pedido_id INT NOT NULL,
  producto_id VARCHAR(80) NOT NULL,
  producto_nombre VARCHAR(150) NOT NULL,
  cantidad INT NOT NULL,
  precio_unitario DECIMAL(10,2) NOT NULL,
  total_linea DECIMAL(10,2) NOT NULL,
  CONSTRAINT fk_detalle_pedido FOREIGN KEY (pedido_id) REFERENCES pedidos(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
