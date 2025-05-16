import mysql from 'mysql2/promise';

// Cargar las variables de entorno
import dotenv from 'dotenv';
dotenv.config();

// Configuración de la base de datos
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD, 
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

export { pool as db };
