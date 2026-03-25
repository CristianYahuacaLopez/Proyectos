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
import { verificarUsuario, guardarNuevoUsuario, obtenerPreguntaPorCorreo, validarRespuestaRecuperacion } from "../services/service.js"; 

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const mostrarLogin = (req, res) => {
    res.sendFile(path.join(__dirname, "../public/html/login.html"));
};

export const validarLogin = async (req, res) => {
    const resultado = await verificarUsuario(req.body);
    if (resultado.success) {
        res.status(200).json(resultado);
    } else {
        res.status(401).json(resultado); // 401 si no existe o falla
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

//para recuperación de contraseña
export const mostrarRecuperar = (req, res) => {
    res.sendFile(path.join(__dirname, "../public/html/recuperarForm.html"));
};

export const getPregunta = async (req, res) => {
    const { correo } = req.body;
    const resultado = await obtenerPreguntaPorCorreo(correo);
    
    if (resultado.success) {
        res.status(200).json(resultado);
    } else {
        res.status(404).json(resultado); 
    }
};

// 4. Valida la respuesta y entrega el JSON con la contraseña
export const verificarRecuperacion = async (req, res) => {
    const { correo, respuestaSecreta } = req.body;
    const resultado = await validarRespuestaRecuperacion(correo, respuestaSecreta);
    
    if (resultado.success) {
        res.status(200).json(resultado);
    } else {
        res.status(401).json(resultado); 
    }
};

