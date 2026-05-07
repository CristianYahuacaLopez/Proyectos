/**
 * Aquí se define la estructura de los datos,
 * en su caso mapeo de datos a una base de datos.
 * 
 * Para el caso del formulario.
 *  1. Registrar usuario
 *  2. Recuperar usuario
 *  3. Modificar contraseña
 */


import { readFile, writeFile } from 'fs/promises';
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const FILE_PATH = path.join(__dirname, "../data/users.json");

export const readUsers = async () => {
  try {
    const data = await readFile(FILE_PATH, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    return []; 
  }
};

export const writeUser = async (newUser) => {
  try {
    const users = await readUsers();
    users.push(newUser);
    await writeFile(FILE_PATH, JSON.stringify(users, null, 2));
    return true;
  } catch (error) {
    console.error('Error al escribir:', error);
    return false;
  }
};

export const findUserByEmail = async (email) => {
  const users = await readUsers();
  return users.find(u => u.correo.toLowerCase() === email.toLowerCase()) || null;
};

export const writeAllUsers = async (usersList) => {
  try {
    await writeFile(FILE_PATH, JSON.stringify(usersList, null, 2));
    return true;
  } catch (error) {
    console.error('Error al actualizar el archivo JSON:', error);
    return false;
  }
};