import { getAllUsers, createUser, getByEmail,updatePassword as updatePassModel } from '../models/usersSQLServer.js';
import { validateUser } from '../models/validator.js';


export const getUsers = async (req, res) => {
  try {
    const users = await getAllUsers();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const registerUser = async (req, res) => {
  try {
    validateUser(req.body);

    const id = await createUser(req.body);

    res.status(201).json({ id });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const findByEmail = async (req, res) => {
  try {
    const users = await getByEmail(req.params.correo);
    res.json(users);
  } catch (error) {
    console.error("DETALLE DEL ERROR EN API:", error.message);
    res.status(500).json({ error: error.message });
  }
};


export const updatePassword = async (req, res) => {
  try {
    const { correo, contrasena } = req.body;
    await updatePassModel(correo, contrasena);
    res.json({ success: true, mensaje: "Contraseña actualizada en SQL Server" });
  } catch (error) {
    res.status(500).json({ success: false, mensaje: error.message });
  }
};

const crudSQL = { getUsers, registerUser, findByEmail, updatePassword };
export default crudSQL;