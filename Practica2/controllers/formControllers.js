/**
 * Encargado de procesar las peticiones
 * Responsabilidades:
 *   1. Recibir datos del formulario.
 *   2. Procesos de validación adicionales.
 *   3. Llamar a servicios para procesar datos, si es el caso.
 *   4. Devolver respuesta al cliente. 
 */

import path from "path";
import { fileURLToPath } from "url";
import { verificarUsuario, guardarNuevoUsuario, procesarRegistro } from "../services/service.js"; 

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const mostrarLogin = (req, res) => {
    res.sendFile(path.join(__dirname, "../public/html/login.html"));
};

export const validarLogin = async (req, res) => {
    const datos = req.body;
    // Lógica para comparar con el usuario de prueba 
    const resultado = await verificarUsuario(datos);
    
    if (resultado.success) {
        res.status(200).json(resultado);
    } else {
        res.status(401).json(resultado);
    }
};

//para nuevo registro
export const mostrarRegistro = (req, res) => {
    res.sendFile(path.join(__dirname, "../public/html/registro.html"));
};

export const crearCuenta = async (req, res) => {
    const {nombre, correo, password, preguntaSecreta, respuestaSecreta } = req.body;
        const resultado = await guardarNuevoUsuario({ 
            nombre, 
            correo, 
            password, 
            preguntaSecreta, 
            respuestaSecreta
        });
    
    res.status(201).json(resultado);
};

