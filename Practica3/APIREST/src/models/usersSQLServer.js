import { getConnection } from '../config/sqlserver.js';
import sql from 'mssql';

export const getAllUsers = async () => {
    const pool = await getConnection();
    const result = await pool.request().query('SELECT * FROM users');
    return result.recordset;
};

export const createUser = async (user) => {
    const pool = await getConnection();
    const result = await pool.request()
        .input('nombre', sql.NVarChar, user.nombre)
        .input('correo', sql.NVarChar, user.correo)
        .input('contrasena', sql.NVarChar, user.contrasena)
        .input('id_pregunta', sql.Int, user.id_pregunta)
        .input('respuestarc', sql.NVarChar, user.respuestarc)
        .query('INSERT INTO users (nombre, correo, contrasena, id_pregunta, respuestarc) OUTPUT INSERTED.id VALUES (@nombre, @correo, @contrasena, @id_pregunta, @respuestarc)');
    return result.recordset[0].id;
};

export const getByEmail = async (correo) => {
    const pool = await getConnection();
    const result = await pool.request()
        .input('correo', sql.NVarChar, correo)
        .query('SELECT * FROM users WHERE correo = @correo');
    return result.recordset;
};