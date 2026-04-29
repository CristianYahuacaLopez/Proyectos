import { getConnection } from '../config/sqlserver.js';

// SQL Server
export const getAllUsers = async () => {  
    const pool = await getConnection();
    const result = await pool.request().query('SELECT * FROM users');
    return result.recordset;  
};

export const createUser = async (user) => {
  const { nombre, correo, contrasena, preguntarc, respuestarc } = user;

  const pool = await getConnection();

  const result = await pool.request()
    .input('nombre', nombre)
    .input('correo', correo)
    .input('contrasena', contrasena)
    .input('preguntarc', preguntarc)
    .input('respuestarc', respuestarc)
    .query(`
      INSERT INTO users (nombre, correo, contrasena, preguntarc, respuestarc)
      VALUES (@nombre, @correo, @contrasena, @preguntarc, @respuestarc);

      SELECT SCOPE_IDENTITY() AS id;
    `);

  return result.recordset[0].id;
};

export const getByEmail = async (email) => {
  const pool = await getConnection();
  const result = await pool.request()
  .input('email',sql.VarChar,email)
  .query('SELECT * FROM users WHERE correo = '+email);
  return result.recordset;  
}
