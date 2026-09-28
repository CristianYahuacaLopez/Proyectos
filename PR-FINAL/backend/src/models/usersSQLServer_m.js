import { getConnection } from '../config/sqlserver.js'; // Importa la función que nos da acceso (el puente) a la base de datos
import sql from 'mssql'; // Importa el driver de SQL Server para definir los tipos de datos 

// Función para buscar un usuario por su correo electrónico (Usada en el Login)
export const getByEmail = async (correo) => {
  const pool = await getConnection(); // Abre la conexión
  const result = await pool.request()
    .input('correo', sql.VarChar, correo) // Sanitiza el dato para evitar Inyección SQL
    .query(`
      SELECT u.id_usuario, u.username, u.correo, u.password_hash, u.id_rol, u.activo, r.nombre_rol 
      FROM Usuarios u
      JOIN Roles r ON u.id_rol = r.id_rol -- Une la tabla Usuarios con Roles para traer el nombre del rol en texto
      WHERE u.correo = @correo AND u.activo = 1 -- Solo trae al usuario si existe y NO ha sido borrado lógicamente
    `);
  return result.recordset[0]; // Retorna solo el primer registro encontrado (el objeto del usuario)
};

// Función para obtener la lista de todos los usuarios activos
export const getAllUsers = async () => {  
  const pool = await getConnection();
  const result = await pool.request().query(`
    SELECT u.id_usuario, u.username, u.correo, u.id_rol, r.nombre_rol 
    FROM Usuarios u
    JOIN Roles r ON u.id_rol = r.id_rol
    WHERE u.activo = 1 -- Filtro crucial: Esconde a los usuarios que tienen borrado lógico
  `);
  return result.recordset;  // Retorna el arreglo completo con todos los usuarios encontrados
};

// Función para eliminar un usuario (Aplicación del Borrado Lógico)
export const logicalDelete = async (id_usuario) => {
  const pool = await getConnection();
  const result = await pool.request()
    .input('id', sql.Int, id_usuario)
    .query('UPDATE Usuarios SET activo = 0 WHERE id_usuario = @id'); // Apaga al usuario sin borrarlo del disco duro
  return result.rowsAffected[0]; // Retorna el número de filas que se modificaron (debería ser 1)
};

// Función para crear un nuevo usuario en la base de datos
export const createUser = async (usuario) => {
  const pool = await getConnection();
  const result = await pool.request()
    .input('username', sql.VarChar, usuario.username)
    .input('correo', sql.VarChar, usuario.correo)
    .input('password_hash', sql.VarChar, usuario.password_hash) // Guarda la contraseña ya encriptada
    .input('id_rol', sql.TinyInt, usuario.id_rol)
    .query(`
      INSERT INTO Usuarios (username, correo, password_hash, id_rol, activo)
      VALUES (@username, @correo, @password_hash, @id_rol, 1); -- El 1 asegura que nazca "activo" por defecto
    `);
  return result.rowsAffected[0];
};

// Función para actualizar los datos de un usuario existente
export const updateUser = async (id_usuario, datos) => {
  const pool = await getConnection();
  const result = await pool.request()
    .input('id', sql.Int, id_usuario)
    .input('username', sql.VarChar, datos.username)
    .input('correo', sql.VarChar, datos.correo)
    .query(`
      UPDATE Usuarios 
      SET username = @username, correo = @correo 
      WHERE id_usuario = @id AND activo = 1 -- Doble candado: Solo actualiza si el ID coincide y si el usuario está activo
    `);
  return result.rowsAffected[0];
};