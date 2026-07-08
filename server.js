/* =========================================================
   SERVER.JS - BACKEND EN JAVASCRIPT/Node.js
   ---------------------------------------------------------
   COMENTARIO PARA EL INFORME:
   - Aquí están las rutas de registro, login y pedidos.
   - Se usa MySQL para guardar usuarios e historial de compras.
   - Las consultas usan parámetros (?) para mayor seguridad.
   ========================================================= */

const express = require('express');
const path = require('path');
const fs = require('fs');
const session = require('express-session');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const pool = require('./db');

/* REQUISITO BD: catálogo base usado para sembrar productos y controlar stock en MySQL. */
const PRODUCTOS_BASE = JSON.parse(fs.readFileSync(path.join(__dirname, 'products-data.json'), 'utf8'));

const app = express();
const PORT = process.env.PORT || 3000;

app.use(helmet({ contentSecurityPolicy: false }));
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));

app.use(session({
  name: 'pokecafe_sid',
  secret: process.env.SESSION_SECRET || 'cambia-esta-clave-en-env',
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 1000 * 60 * 60
  }
}));

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Demasiados intentos. Espera unos minutos e intenta otra vez.' }
});

const publicPath = path.join(__dirname, 'main_Page');
app.use(express.static(publicPath));
app.use('/main_Page', express.static(publicPath));

/* REQUISITO: función de validación básica de correo. */
function validarCorreo(correo) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo);
}

/* REQUISITO: condicional para proteger rutas que requieren sesión. */
function requireAuth(req, res, next) {
  if (!req.session.usuario) {
    return res.status(401).json({ error: 'Debes iniciar sesión para continuar.' });
  }
  next();
}

/* REQUISITO BD: consultas SQL para crear tablas relacionales si no existen. */
async function crearTablasSiNoExisten() {
  await pool.execute(`CREATE TABLE IF NOT EXISTS usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario VARCHAR(15) NOT NULL,
    correo VARCHAR(150) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY uq_usuarios_correo (correo)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`);

  await pool.execute(`CREATE TABLE IF NOT EXISTS productos (
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
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`);

  /* REQUISITO BD: se insertan productos iniciales sin reiniciar el stock si ya existen. */
  for (const producto of PRODUCTOS_BASE) {
    await pool.execute(
      `INSERT INTO productos
       (id, nombre, categoria, img, descripcion, precio_original, precio, popular, stock, etiqueta, oferta, activo)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1)
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
        activo = 1`,
      [
        producto.id, producto.nombre, producto.categoria, producto.img, producto.descripcion,
        producto.precioOriginal, producto.precio, producto.popular ? 1 : 0,
        producto.stock, producto.etiqueta || '', producto.oferta ? 1 : 0
      ]
    );
  }


  await pool.execute(`CREATE TABLE IF NOT EXISTS pedidos (
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
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`);

  await pool.execute(`CREATE TABLE IF NOT EXISTS pedido_detalles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    pedido_id INT NOT NULL,
    producto_id VARCHAR(80) NOT NULL,
    producto_nombre VARCHAR(150) NOT NULL,
    cantidad INT NOT NULL,
    precio_unitario DECIMAL(10,2) NOT NULL,
    total_linea DECIMAL(10,2) NOT NULL,
    CONSTRAINT fk_detalle_pedido FOREIGN KEY (pedido_id) REFERENCES pedidos(id) ON DELETE CASCADE
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`);
}

app.get('/', (req, res) => {
  res.redirect('/login.html');
});

/* REQUISITO: ruta para registrar usuarios en la BD. */
app.post('/api/register', authLimiter, async (req, res) => {
  try {
    const usuario = String(req.body.usuario || '').trim();
    const correo = String(req.body.correo || '').trim().toLowerCase();
    const password = String(req.body.password || '');

    if (!usuario || !correo || !password) {
      return res.status(400).json({ error: 'Completa usuario, correo y contraseña.' });
    }
    if (usuario.length > 15) {
      return res.status(400).json({ error: 'El usuario no debe pasar de 15 caracteres.' });
    }
    if (!validarCorreo(correo)) {
      return res.status(400).json({ error: 'El correo no tiene un formato válido.' });
    }
    if (password.length < 8) {
      return res.status(400).json({ error: 'La contraseña debe tener mínimo 8 caracteres.' });
    }

    const [existente] = await pool.execute('SELECT id FROM usuarios WHERE correo = ? LIMIT 1', [correo]);
    if (existente.length > 0) {
      return res.status(409).json({ error: 'Ya existe una cuenta registrada con ese correo.' });
    }

    const passwordHash = await bcrypt.hash(password, 12);
    await pool.execute(
      'INSERT INTO usuarios (usuario, correo, password_hash) VALUES (?, ?, ?)',
      [usuario, correo, passwordHash]
    );

    return res.status(201).json({ mensaje: 'Registro correcto. Ahora puedes iniciar sesión.' });
  } catch (error) {
    if (error && error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ error: 'Ya existe una cuenta registrada con ese correo.' });
    }
    console.error('Error en registro:', error);
    return res.status(500).json({ error: 'Error interno del servidor.' });
  }
});

/* REQUISITO: ruta para iniciar sesión y comparar contraseña protegida. */
app.post('/api/login', authLimiter, async (req, res) => {
  try {
    const correo = String(req.body.correo || '').trim().toLowerCase();
    const password = String(req.body.password || '');

    if (!correo || !password) {
      return res.status(400).json({ error: 'Completa correo y contraseña.' });
    }

    const [usuarios] = await pool.execute(
      'SELECT id, usuario, correo, password_hash FROM usuarios WHERE correo = ? LIMIT 1',
      [correo]
    );

    if (usuarios.length === 0) {
      return res.status(401).json({ error: 'Correo o contraseña incorrectos.' });
    }

    const cuenta = usuarios[0];
    const passwordValida = await bcrypt.compare(password, cuenta.password_hash);

    if (!passwordValida) {
      return res.status(401).json({ error: 'Correo o contraseña incorrectos.' });
    }

    req.session.usuario = { id: cuenta.id, usuario: cuenta.usuario, correo: cuenta.correo };
    return res.json({ mensaje: 'Inicio de sesión correcto.', usuario: req.session.usuario });
  } catch (error) {
    console.error('Error en login:', error);
    return res.status(500).json({ error: 'Error interno del servidor.' });
  }
});

app.get('/api/session', (req, res) => {
  if (!req.session.usuario) return res.status(401).json({ autenticado: false });
  return res.json({ autenticado: true, usuario: req.session.usuario });
});


/* REQUISITO BD: ruta que entrega productos desde MySQL, incluyendo stock actual. */
app.get('/api/products', async (req, res) => {
  try {
    const [productos] = await pool.execute(
      `SELECT id, nombre, categoria, img, descripcion, precio_original, precio, popular, stock, etiqueta, oferta
       FROM productos
       WHERE activo = 1
       ORDER BY nombre ASC`
    );
    return res.json({ productos });
  } catch (error) {
    console.error('Error leyendo productos:', error);
    return res.status(500).json({ error: 'No se pudo cargar el catálogo.' });
  }
});

app.post('/api/logout', (req, res) => {
  req.session.destroy(() => {
    res.clearCookie('pokecafe_sid');
    res.json({ mensaje: 'Sesión cerrada.' });
  });
});

/* REQUISITO: ruta para guardar compras en el historial del usuario.
   REQUISITO BD: valida stock real en MySQL y lo descuenta al confirmar la compra. */
app.post('/api/orders', requireAuth, async (req, res) => {
  const connection = await pool.getConnection();
  try {
    const cliente = String(req.body.cliente || '').trim();
    const telefono = String(req.body.telefono || '').trim();
    const direccion = String(req.body.direccion || '').trim();
    const metodoEntrega = String(req.body.metodo_entrega || 'delivery').trim();
    const metodoPago = String(req.body.metodo_pago || 'efectivo').trim();
    const notas = String(req.body.notas || '').trim();
    const items = Array.isArray(req.body.items) ? req.body.items : [];

    if (!cliente || !telefono || !direccion) {
      return res.status(400).json({ error: 'Completa nombre, teléfono y dirección.' });
    }
    if (items.length === 0) {
      return res.status(400).json({ error: 'Selecciona al menos un producto.' });
    }

    const cantidadesSolicitadas = items.reduce((acc, item) => {
      const id = String(item.id || '').slice(0, 80);
      const cantidad = Math.max(1, Number.parseInt(item.cantidad, 10) || 1);
      if (id) acc[id] = (acc[id] || 0) + cantidad;
      return acc;
    }, {});

    const ids = Object.keys(cantidadesSolicitadas);
    if (!ids.length) {
      return res.status(400).json({ error: 'El pedido no tiene productos válidos.' });
    }

    await connection.beginTransaction();

    const itemsValidados = [];
    for (const id of ids) {
      const [rows] = await connection.execute(
        `SELECT id, nombre, precio, stock
         FROM productos
         WHERE id = ? AND activo = 1
         FOR UPDATE`,
        [id]
      );

      if (rows.length === 0) {
        throw Object.assign(new Error('Producto no disponible.'), { status: 400 });
      }

      const producto = rows[0];
      const cantidad = cantidadesSolicitadas[id];

      if (Number(producto.stock) < cantidad) {
        throw Object.assign(
          new Error(`Stock insuficiente para ${producto.nombre}. Disponible: ${producto.stock}.`),
          { status: 409 }
        );
      }

      await connection.execute('UPDATE productos SET stock = stock - ? WHERE id = ?', [cantidad, id]);

      itemsValidados.push({
        id: producto.id,
        nombre: producto.nombre,
        cantidad,
        precio: Number(producto.precio)
      });
    }

    const subtotal = itemsValidados.reduce((sum, item) => sum + item.precio * item.cantidad, 0);
    const envio = metodoEntrega === 'tienda' ? 0 : 4.90;
    const descuento = subtotal >= 35 ? Number((subtotal * 0.10).toFixed(2)) : 0;
    const total = Number((subtotal + envio - descuento).toFixed(2));

    const [resultado] = await connection.execute(
      `INSERT INTO pedidos
      (usuario_id, cliente, correo, telefono, direccion, metodo_entrega, metodo_pago, notas, subtotal, envio, descuento, total, estado)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [req.session.usuario.id, cliente, req.session.usuario.correo, telefono, direccion, metodoEntrega, metodoPago, notas, subtotal, envio, descuento, total, 'Preparando']
    );

    const pedidoId = resultado.insertId;
    for (const item of itemsValidados) {
      await connection.execute(
        `INSERT INTO pedido_detalles
        (pedido_id, producto_id, producto_nombre, cantidad, precio_unitario, total_linea)
        VALUES (?, ?, ?, ?, ?, ?)`,
        [pedidoId, item.id, item.nombre, item.cantidad, item.precio, Number((item.precio * item.cantidad).toFixed(2))]
      );
    }

    await connection.commit();

    return res.status(201).json({
      mensaje: 'Pedido enviado, stock descontado y compra guardada en tu historial.',
      pedido: { id: pedidoId, total }
    });
  } catch (error) {
    await connection.rollback();
    console.error('Error creando pedido:', error);
    return res.status(error.status || 500).json({ error: error.message || 'No se pudo guardar el pedido.' });
  } finally {
    connection.release();
  }
});

/* REQUISITO: ruta para leer tabla de pedidos realizados por usuario. */
app.get('/api/orders', requireAuth, async (req, res) => {
  try {
    const [pedidos] = await pool.execute(
      `SELECT id, cliente, correo, telefono, direccion, metodo_entrega, metodo_pago, subtotal, envio, descuento, total, estado, creado_en
       FROM pedidos
       WHERE usuario_id = ?
       ORDER BY creado_en DESC`,
      [req.session.usuario.id]
    );

    if (pedidos.length === 0) return res.json({ pedidos: [] });

    const ids = pedidos.map((pedido) => pedido.id);
    const placeholders = ids.map(() => '?').join(',');
    const [detalles] = await pool.execute(
      `SELECT pedido_id, producto_id, producto_nombre, cantidad, precio_unitario, total_linea
       FROM pedido_detalles
       WHERE pedido_id IN (${placeholders})
       ORDER BY id ASC`,
      ids
    );

    const detallesPorPedido = detalles.reduce((acc, detalle) => {
      if (!acc[detalle.pedido_id]) acc[detalle.pedido_id] = [];
      acc[detalle.pedido_id].push(detalle);
      return acc;
    }, {});

    const data = pedidos.map((pedido) => ({ ...pedido, detalles: detallesPorPedido[pedido.id] || [] }));
    return res.json({ pedidos: data });
  } catch (error) {
    console.error('Error leyendo pedidos:', error);
    return res.status(500).json({ error: 'No se pudo cargar el historial de pedidos.' });
  }
});

crearTablasSiNoExisten()
  .then(() => {
    app.listen(PORT, () => console.log(`Servidor activo en http://localhost:${PORT}`));
  })
  .catch((error) => {
    console.error('No se pudieron preparar las tablas MySQL:', error);
    app.listen(PORT, () => console.log(`Servidor activo en http://localhost:${PORT}`));
  });
