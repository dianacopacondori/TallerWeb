const express = require('express');
const path = require('path');
const session = require('express-session');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const pool = require('./db');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(helmet({
  contentSecurityPolicy: false
}));

app.use(express.json());
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

function validarCorreo(correo) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo);
}

app.get('/', (req, res) => {
  res.redirect('/login.html');
});

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

    const [existente] = await pool.execute(
      'SELECT id FROM usuarios WHERE correo = ? LIMIT 1',
      [correo]
    );

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

    req.session.usuario = {
      id: cuenta.id,
      usuario: cuenta.usuario,
      correo: cuenta.correo
    };

    return res.json({
      mensaje: 'Inicio de sesión correcto.',
      usuario: {
        usuario: cuenta.usuario,
        correo: cuenta.correo
      }
    });
  } catch (error) {
    console.error('Error en login:', error);
    return res.status(500).json({ error: 'Error interno del servidor.' });
  }
});

app.get('/api/session', (req, res) => {
  if (!req.session.usuario) {
    return res.status(401).json({ autenticado: false });
  }

  return res.json({ autenticado: true, usuario: req.session.usuario });
});

app.post('/api/logout', (req, res) => {
  req.session.destroy(() => {
    res.clearCookie('pokecafe_sid');
    res.json({ mensaje: 'Sesión cerrada.' });
  });
});

app.listen(PORT, () => {
  console.log(`Servidor activo en http://localhost:${PORT}`);
});
