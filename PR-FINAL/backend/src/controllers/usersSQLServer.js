import jwt from 'jsonwebtoken'; // Librería para crear y firmar los JSON Web Tokens tras un login exitoso
import bcrypt from 'bcrypt'; // Librería de criptografía para encriptar (hashear) y verificar contraseñas
import * as UserModel from '../models/usersSQLServer_m.js'; // Importa el Modelo, que es el único autorizado para hablar con SQL

// Controlador para iniciar sesión (Login)
export const login = async (req, res) => {
  try {
    const { correo, contrasena } = req.body;
    // Delega al Modelo la tarea de buscar al usuario en la BD
    const user = await UserModel.getByEmail(correo);

    // 404: El usuario no existe en la base de datos
    if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });
    
    // Compara la contraseña que el usuario escribió (texto plano) con la que está encriptada en la BD
    const validPassword = await bcrypt.compare(contrasena, user.password_hash);
    if (!validPassword) return res.status(401).json({ message: 'Contraseña incorrecta' });

    // Generamos el Token JWT
    // Se "empaquetan" datos no sensibles (payload) como el ID y el rol, y se firman con la clave secreta
    const token = jwt.sign(
      { id: user.id_usuario, rol: user.id_rol, nombre_rol: user.nombre_rol }, 
      process.env.JWT_SECRET, 
      { expiresIn: '2h' } // Regla de seguridad: el token caduca en 2 horas
    );

    // Se le envía el token al frontend para que lo guarde y lo use en futuras peticiones
    res.json({ token, username: user.username, rol: user.nombre_rol });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Controlador para listar todos los usuarios
export const getUsers = async (req, res) => {
  try {
    const users = await UserModel.getAllUsers();
    res.json(users); // Devuelve la lista en formato JSON al frontend
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Controlador para eliminar un usuario (Borrado Lógico)
export const deleteUser = async (req, res) => {
  try {
    const idAEliminar = parseInt(req.params.id); // Extrae el ID de la URL 
    // req.user viene del middleware auto.js, que desencriptó el token previamente
    const idPeticion = req.user.id;
    const rolPeticion = req.user.nombre_rol;

    // Regla: Admin elimina a cualquiera, Operativo (Agente) solo a sí mismo.
    // Lógica de Autorización basada en roles
    if (rolPeticion === 'Agente' && idAEliminar !== idPeticion) {
      return res.status(403).json({ message: 'Los agentes solo pueden eliminar su propia cuenta' });
    }

    // Delega al Modelo la tarea de hacer el UPDATE en la base de datos (borrado lógico, no físico)
    await UserModel.logicalDelete(idAEliminar);
    res.json({ message: 'Usuario eliminado lógicamente' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Controlador para crear un usuario nuevo
export const register = async (req, res) => {
  try {
    const { username, correo, contrasena, id_rol } = req.body;
    
    // Encriptamos la contraseña con bcrypt antes de guardarla
    // genSalt(10) genera un valor aleatorio complejo para hacer la encriptación impredecible
    const salt = await bcrypt.genSalt(10);
    // hash() fusiona la contraseña plana con el salt
    const password_hash = await bcrypt.hash(contrasena, salt);

    // Manda al Modelo los datos, reemplazando la contraseña plana por el hash seguro
    await UserModel.createUser({ username, correo, password_hash, id_rol });
    
    res.status(201).json({ message: 'Usuario registrado exitosamente' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Controlador para actualizar un usuario
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