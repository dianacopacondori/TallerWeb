-- =========================================================
-- DATABASE.SQL - CONSULTAS SQL EJECUTADAS EN MYSQL
-- ---------------------------------------------------------
-- COMENTARIO PARA EL INFORME:
-- Este archivo evidencia la creación de tablas relacionales
-- para usuarios, pedidos e historial de compras.
-- =========================================================

USE defaultdb;

-- Tabla de usuarios registrados.
-- REQUISITO BD: correo UNIQUE evita más de una cuenta con el mismo correo.
CREATE TABLE IF NOT EXISTS usuarios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  usuario VARCHAR(15) NOT NULL,
  correo VARCHAR(150) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uq_usuarios_correo (correo)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- Tabla de productos con stock real.
-- REQUISITO BD: permite descontar unidades y mostrar "agotado" cuando stock llega a 0.
CREATE TABLE IF NOT EXISTS productos (
  id VARCHAR(80) PRIMARY KEY,
  nombre VARCHAR(150) NOT NULL,
  categoria VARCHAR(60) NOT NULL,
  img VARCHAR(255) NOT NULL,
  descripcion TEXT,
  precio_original DECIMAL(10,2) NOT NULL,
  precio DECIMAL(10,2) NOT NULL,
  popular TINYINT(1) NOT NULL DEFAULT 0,
  stock INT NOT NULL DEFAULT 0,
  etiqueta VARCHAR(80),
  oferta TINYINT(1) NOT NULL DEFAULT 0,
  activo TINYINT(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Productos iniciales del menú.
-- IMPORTANTE: ON DUPLICATE KEY UPDATE no reinicia el stock, para no borrar descuentos de compras ya realizadas.
INSERT INTO productos
(id, nombre, categoria, img, descripcion, precio_original, precio, popular, stock, etiqueta, oferta)
VALUES
  ('pokebowl', 'Pokebowl', 'Platos', 'img/img_menu/pokebowl.jpg', 'Arroz, pollo, vegetales frescos y salsa especial del Café.', 18, 12, 1, 6, 'Más vendido', 1),
  ('charizard-roast', 'Charizard Roast', 'Bebidas', 'img/img_menu/CharizardRoast.png', 'Espresso intenso con leche vaporizada y canela ahumada.', 14, 9.9, 1, 5, 'Flash sale', 0),
  ('pika-cheesecake', 'Pika-Pika Cheesecake', 'Postres', 'img/img_menu/Pika-PikaCheesecake.png', 'Cheesecake japonés esponjoso con glaseado amarillo y decoración de cola de Pikachu.', 20, 12, 1, 4, 'Últimas unidades', 1),
  ('mewtwo-zen', 'Mewtwo Zen Bowl', 'Platos', 'img/img_menu/MewtwoZenBowl.png', 'Bowl de arroz integral, tofu, edamame, aguacate y aderezo de miso blanco.', 18, 13, 1, 7, 'Proteico', 0),
  ('snorlax-mac', 'Snorlax Comfort Mac & Cheese', 'Platos', 'img/img_menu/SnorlaxComfortMac&Cheese.png', 'Macarrones gratinados con tres quesos fundidos, migas tostadas y nuez moscada.', 21, 16, 1, 6, 'Clásico', 0),
  ('pikachu-latte', 'Pikachu Latte', 'Bebidas', 'img/img_menu/pikachu-latte.jpg', 'Café suave con espuma artística inspirada en Pikachu.', 12, 9, 1, 10, 'Favorito', 0),
  ('galletas', 'Galletas Decoradas', 'Postres', 'img/img_menu/GalletasDecoradas.png', 'Galletas con glaseado y decoraciones de Pokémon.', 8, 4, 0, 2, 'Próximo a vencer', 1),
  ('eeveelution-macarons', 'Eeveelution Macarons', 'Postres', 'img/img_menu/EeveelutionMacarons.png', 'Set de macarons con sabores inspirados en las evoluciones de Eevee.', 15, 7.5, 1, 3, 'Próximo a vencer', 1),
  ('postre-pikachu', 'Postre Pikachu', 'Postres', 'img/img_menu/pikachu-dessert.jpg', 'Postre dulce de vainilla con crema y forma de Pikachu.', 10, 7, 1, 4, 'Solo por hoy', 1),
  ('clefairy-pancakes', 'Clefairy Fluffy Pancakes', 'Postres', 'img/img_menu/ClefairyPancakes.png', 'Tortitas esponjosas con sirope de arce, frutas de temporada y nube de crema.', 18, 15, 0, 6, 'Favorito', 1),
  ('gengar-shadow-brownie', 'Gengar Shadow Brownie', 'Postres', 'img/img_menu/GengarShadowBrownie.png', 'Brownie denso de chocolate negro con helado y salsa de frutos rojos.', 16, 11, 0, 3, 'Últimas unidades', 0),
  ('jynx-sorbet', 'Jynx Frost Sorbet Trio', 'Postres', 'img/img_menu/JynxFrostSorbetTrio.png', 'Tres bolas de sorbete artesanal con coulis de frutos rojos y menta fresca.', 10, 8.5, 0, 8, 'Helado', 0),
  ('magcargo-cake', 'Magcargo Molten Cake', 'Postres', 'img/img_menu/MagcargoMoltenCake.png', 'Bizcocho individual de chocolate negro con centro fundido y helado de vainilla.', 12, 9.9, 0, 7, 'Caliente', 0),
  ('eevee-pancakes', 'Eevee Pancakes', 'Postres', 'img/img_menu/EeveePancakes.png', 'Tortitas esponjosas con sirope de arce, frutas y crema.', 15, 10.5, 0, 8, 'Oferta', 0),
  ('pokedonas', 'PokeDonas', 'Postres', 'img/img_menu/Donas.png', 'Donas suaves con glaseado de azúcar y una pizca de canela.', 8, 6.5, 0, 9, 'Dulce', 0),
  ('gengar-brownie', 'Gengar Brownie', 'Postres', 'img/img_menu/GengarBrownie.png', 'Brownie de chocolate oscuro con nueces y un toque de chile.', 11, 8.8, 0, 5, 'Intenso', 0),
  ('pokecupcakes', 'PokéCupcakes', 'Postres', 'img/img_menu/Cupcakes.png', 'Cupcakes suaves con glaseado de azúcar y decoración de colores.', 9, 7.2, 0, 7, 'Dulce', 0),
  ('bulbasaur-matcha', 'Bulbasaur Matcha Latte', 'Bebidas', 'img/img_menu/BulbasaurMatchaLatte.png', 'Latte de matcha con leche de avena y un toque de miel.', 13, 10, 0, 9, 'Vegano', 0),
  ('glaceon-frappe', 'Glaceon Ice Crystal Frappé', 'Bebidas', 'img/img_menu/GlaceonIceCrystalFrapp%23U00e9.png', 'Frappé helado con sabor suave, hielo triturado y toque dulce.', 12, 9.8, 0, 6, 'Frío', 0),
  ('jigglypuff-smoothie', 'Jigglypuff Melody Smoothie', 'Bebidas', 'img/img_menu/JigglypuffMelodySmoothie.png', 'Smoothie de frutas con textura cremosa y presentación temática.', 13, 10.5, 0, 8, 'Suave', 0),
  ('mewtwo-latte', 'Mewtwo Galaxy Latte', 'Bebidas', 'img/img_menu/MewtwoGalaxyLatte.png', 'Latte de colores galácticos con leche cremosa y toque dulce.', 14, 11.2, 0, 6, 'Especial', 0),
  ('snorlax-chocolate', 'Snorlax Comfort Chocolate', 'Bebidas', 'img/img_menu/SnorlaxComfortChocolate.png', 'Chocolate caliente cremoso con sabor profundo y reconfortante.', 16, 12.5, 0, 7, 'Clásico', 0),
  ('squirtle-smoothie', 'Squirtle Smoothie Bowl', 'Bebidas', 'img/img_menu/SquirtleSmoothieBowl.png', 'Smoothie bowl refrescante con frutas, crema y decoración marina.', 15, 12, 0, 6, 'Refrescante', 0),
  ('arcanine-wings', 'Arcanine Ember Wings', 'Platos', 'img/img_menu/ArcanineEmberWings.png', 'Bocaditos crujientes de coliflor o pollo marinado con salsa de yogur al limón.', 16, 12.8, 0, 6, 'Picante', 0),
  ('chansey-custard', 'Chansey Egg Custard', 'Platos', 'img/img_menu/ChanseyEggCustard.png', 'Flan de huevo al estilo japonés con dashi suave, camarón y textura sedosa.', 9, 7.2, 0, 8, 'Suave', 0),
  ('electrabuzz-chicken', 'Electrabuzz Citrus Chicken', 'Platos', 'img/img_menu/ElectrabuzzCitrusChicken.png', 'Pechuga de pollo con glaseado de naranja y mostaza, puré y ensalada verde.', 18, 14.5, 0, 5, 'Cítrico', 0),
  ('gardevoir-tartine', 'Gardevoir Royal Tartine', 'Platos', 'img/img_menu/GardevoirRoyalTartine.png', 'Brioche tostado con queso de cabra, pera caramelizada, pecanas y miel.', 14, 11.2, 0, 6, 'Royal', 0),
  ('gyarados-pasta', 'Gyarados Marinara Pasta', 'Platos', 'img/img_menu/GyaradosMarinaraPasta.png', 'Espagueti al dente con salsa de tomate casera, mariscos y perejil fresco.', 17, 13.6, 0, 5, 'Marino', 0),
  ('koffing-bites', 'Koffing Crispy Bites', 'Platos', 'img/img_menu/KoffingCrispyBites.png', 'Bocaditos crujientes marinados en especias suaves con salsa fresca.', 8, 6.4, 0, 7, 'Crocante', 0),
  ('magnezone-fries', 'Magnezone Spark Fries', 'Platos', 'img/img_menu/MagnezoneSparkFries.png', 'Papas rústicas con parmesano, ajo confitado, pimentón y ralladura de limón.', 9, 7.2, 0, 10, 'Clásico', 0),
  ('onix-burger', 'Onix Rock Burger', 'Platos', 'img/img_menu/OnixRockBurger.png', 'Hamburguesa en pan negro con cheddar fundido, cebolla caramelizada y BBQ.', 14, 11.2, 0, 6, 'Fuerte', 0),
  ('rayquaza-roll', 'Rayquaza Sky Roll', 'Platos', 'img/img_menu/RayquazaSkyRoll.png', 'Sushi roll de tempura con aguacate, salmón ahumado, queso crema y teriyaki.', 22, 15, 0, 5, 'Especial', 0)
ON DUPLICATE KEY UPDATE
  nombre = VALUES(nombre),
  categoria = VALUES(categoria),
  img = VALUES(img),
  descripcion = VALUES(descripcion),
  precio_original = VALUES(precio_original),
  precio = VALUES(precio),
  popular = VALUES(popular),
  etiqueta = VALUES(etiqueta),
  oferta = VALUES(oferta),
  activo = 1;

-- Tabla principal de pedidos.
-- REQUISITO BD: cada pedido queda vinculado a usuario_id.
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

-- Tabla de detalle de cada pedido.
-- REQUISITO BD: permite guardar varios productos en un mismo pedido.
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
