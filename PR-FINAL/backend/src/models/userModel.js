// /backend/src/models/userModel.js
const pool = require('../config/sqlserver'); // Importamos tu conexión a la BD

const UserModel = {
    /**
     * Busca un usuario por correo para el inicio de sesión.
     * Solo trae usuarios que NO hayan sido eliminados lógicamente (activo = 1).
     */
    findByEmail: async (email) => {
        const query = `
            SELECT u.*, r.nombre_rol as rol 
            FROM Usuarios u
            JOIN Roles r ON u.rol_id = r.id
            WHERE u.correo = ? AND u.activo = 1
        `;
        const [rows] = await pool.execute(query, [email]);
        return rows[0]; // Retorna el usuario si existe, o undefined
    },

    /**
     * Obtiene todos los usuarios activos para mostrarlos en el tablero.
     * Incorpora el rol del usuario en la respuesta.
     */
    findAll: async () => {
        const query = `
            SELECT u.id, u.nombre, u.correo, u.rol_id, r.nombre_rol as rol 
            FROM Usuarios u 
            JOIN Roles r ON u.rol_id = r.id 
            WHERE u.activo = 1
        `;
        const [rows] = await pool.execute(query);
        return rows;
    },

    /**
     * Realiza una eliminación lógica (cambia el estado a inactivo en lugar de borrar el registro físico).
     */
    logicalDelete: async (id) => {
        const query = `UPDATE Usuarios SET activo = 0 WHERE id = ?`;
        const [result] = await pool.execute(query, [id]);
        return result;
    },

    /**
     * Actualiza los datos de un usuario.
     */
    update: async (id, datos) => {
        // Suponiendo que permites actualizar nombre y correo
        const query = `UPDATE Usuarios SET nombre = ?, correo = ? WHERE id = ?`;
        const [result] = await pool.execute(query, [datos.nombre, datos.correo, id]);
        return result;
    }
};

module.exports = UserModel;