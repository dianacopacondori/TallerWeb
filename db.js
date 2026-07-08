/* =========================================================
   DB.JS - CONEXIÓN A BASE DE DATOS MYSQL
   ---------------------------------------------------------
   COMENTARIO PARA EL INFORME:
   - Este archivo evidencia el código de conexión a una BD
     relacional MySQL en la nube mediante JavaScript/Node.js.
   - Los datos privados se leen desde .env para no exponer claves.
   ========================================================= */

const mysql = require('mysql2/promise');
const fs = require('fs');
require('dotenv').config();

/* REQUISITO BD: opciones SSL necesarias para Aiven/MySQL Cloud. */
const sslOptions = {};

if (process.env.DB_SSL_CA) {
  sslOptions.ssl = {
    ca: fs.readFileSync(process.env.DB_SSL_CA),
    rejectUnauthorized: true
  };
}

/* REQUISITO BD: pool de conexión que usa las variables del archivo .env. */
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  ...sslOptions
});

module.exports = pool;
