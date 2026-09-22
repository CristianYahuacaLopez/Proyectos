import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import * as UserModel from '../models/usersSQLServer_m.js';

export const login = async (req, res) => {
  try {
    const { correo, contrasena } = req.body;
    const user = await UserModel.getByEmail(correo);

    if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });

    // En tu BD debes tener hashes, aquí los compara (asumiendo que los encriptaste con bcrypt)
    // Si tus contraseñas en la BD ahorita están en texto plano, cambia esto por: if(contrasena !== user.password_hash)
    const validPassword = await bcrypt.compare(contrasena, user.password_hash);
    if (!validPassword) return res.status(401).json({ message: 'Contraseña incorrecta' });

    // Generamos el Token JWT
    const token = jwt.sign(
      { id: user.id_usuario, rol: user.id_rol, nombre_rol: user.nombre_rol }, 
      process.env.JWT_SECRET, 
      { expiresIn: '2h' }
    );

    res.json({ token, username: user.username, rol: user.nombre_rol });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getUsers = async (req, res) => {
  try {
    const users = await UserModel.getAllUsers();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const idAEliminar = parseInt(req.params.id);
    const idPeticion = req.user.id;
    const rolPeticion = req.user.nombre_rol;

    // Regla: Admin elimina a cualquiera. Operativo (Agente) solo a sí mismo.
    if (rolPeticion === 'Agente' && idAEliminar !== idPeticion) {
      return res.status(403).json({ message: 'Los agentes solo pueden eliminar su propia cuenta' });
    }

    await UserModel.logicalDelete(idAEliminar);
    res.json({ message: 'Usuario eliminado lógicamente' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const register = async (req, res) => {
  try {
    const { username, correo, contrasena, id_rol } = req.body;
    
    // Encriptamos la contraseña con bcrypt antes de guardarla
    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(contrasena, salt);

    await UserModel.createUser({ username, correo, password_hash, id_rol });
    
    res.status(201).json({ message: 'Usuario registrado exitosamente' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const editUser = async (req, res) => {
  try {
    const idAEditar = parseInt(req.params.id);
    const idPeticion = req.user.id;
    const rolPeticion = req.user.nombre_rol;
    const datosNuevos = req.body;

    // Regla: Los agentes solo pueden modificar sus propios datos
    if (rolPeticion === 'Agente' && idAEditar !== idPeticion) {
      return res.status(403).json({ message: 'Acceso denegado: Los agentes solo pueden modificar sus propios datos.' });
    }

    const filasAfectadas = await UserModel.updateUser(idAEditar, datosNuevos);
    
    if (filasAfectadas === 0) {
      return res.status(404).json({ message: 'Usuario no encontrado o fue eliminado lógicamente.' });
    }

    res.json({ message: 'Usuario actualizado correctamente' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};