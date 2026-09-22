import sql from 'mssql';
import dotenv from 'dotenv';
dotenv.config();


export const sqlServerConfig = {
  user: process.env.SQLSERVER_USER,
  password: process.env.SQLSERVER_PASSWORD,
  server: process.env.SQLSERVER_SERVER,
  database: process.env.SQLSERVER_DB,
  options: {
    encrypt: false,
    trustServerCertificate: true,
  },
};

/*export const getConnection = async () => {
  try {
    return await sql.connect(sqlServerConfig);
  } catch (error) {
    console.error('SQL Server connection error:', error);
  }
};*/

// src/config/sqlserver.js
export const getConnection = async () => {
  try {
    // Es mejor usar un pool global para no abrir conexiones infinitas
    const pool = await sql.connect(sqlServerConfig);
    return pool;
  } catch (error) {
    console.error('¡ERROR CRÍTICO! No se pudo conectar a SQL Server:', error.message);
    throw error; // Lanzar el error para que el controlador lo atrape
  }
};