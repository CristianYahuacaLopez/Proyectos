import { getConnection } from '../config/sqlserver.js';
import sql from 'mssql';

export const getByEmail = async (correo) => {
  const pool = await getConnection();
  const result = await pool.request()
    .input('correo', sql.VarChar, correo)
    .query(`
      SELECT u.id_usuario, u.username, u.correo, u.password_hash, u.id_rol, u.activo, r.nombre_rol 
      FROM Usuarios u
      JOIN Roles r ON u.id_rol = r.id_rol
      WHERE u.correo = @correo AND u.activo = 1
    `);
  return result.recordset[0];
};

export const getAllUsers = async () => {  
  const pool = await getConnection();
  const result = await pool.request().query(`
    SELECT u.id_usuario, u.username, u.correo, u.id_rol, r.nombre_rol 
    FROM Usuarios u
    JOIN Roles r ON u.id_rol = r.id_rol
    WHERE u.activo = 1
  `);
  return result.recordset;  
};

export const logicalDelete = async (id_usuario) => {
  const pool = await getConnection();
  const result = await pool.request()
    .input('id', sql.Int, id_usuario)
    .query('UPDATE Usuarios SET activo = 0 WHERE id_usuario = @id');
  return result.rowsAffected[0];
};

export const createUser = async (usuario) => {
  const pool = await getConnection();
  const result = await pool.request()
    .input('username', sql.VarChar, usuario.username)
    .input('correo', sql.VarChar, usuario.correo)
    .input('password_hash', sql.VarChar, usuario.password_hash)
    .input('id_rol', sql.TinyInt, usuario.id_rol)
    .query(`
      INSERT INTO Usuarios (username, correo, password_hash, id_rol, activo)
      VALUES (@username, @correo, @password_hash, @id_rol, 1);
    `);
  return result.rowsAffected[0];
};

export const updateUser = async (id_usuario, datos) => {
  const pool = await getConnection();
  const result = await pool.request()
    .input('id', sql.Int, id_usuario)
    .input('username', sql.VarChar, datos.username)
    .input('correo', sql.VarChar, datos.correo)
    .query(`
      UPDATE Usuarios 
      SET username = @username, correo = @correo 
      WHERE id_usuario = @id AND activo = 1
    `);
  return result.rowsAffected[0];
};