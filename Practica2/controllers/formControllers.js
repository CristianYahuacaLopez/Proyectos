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
// IMPORTANTE: Agregamos 'guardarNuevoUsuario' al import para que no marque error
import { verificarUsuario, guardarNuevoUsuario, procesarRegistro } from "../services/service.js"; 

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// --- CONTROLADORES PARA EL LOGIN ---
export const mostrarLogin = (req, res) => {
    res.sendFile(path.join(__dirname, "../public/html/login.html"));
};

export const validarLogin = async (req, res) => {
    const datos = req.body;
    // Lógica para comparar con el usuario de prueba "yare@telematica.com"
    const resultado = await verificarUsuario(datos);
    
    if (resultado.success) {
        res.status(200).json(resultado);
    } else {
        res.status(401).json(resultado);
    }
};

// --- CONTROLADORES PARA EL REGISTRO (NUEVO) ---
export const mostrarRegistro = (req, res) => {
    res.sendFile(path.join(__dirname, "../public/html/registro.html"));
};

export const crearCuenta = async (req, res) => {
    const { correo, password } = req.body;
    
    // Aquí usamos la función con el AWAIT de 1.5 segundos
    // Mandamos el correo como "id" porque así lo espera tu service.js
    const resultado = await guardarNuevoUsuario({ id: correo, password });
    
    res.status(201).json(resultado);
};

// --- CONTROLADORES PARA EL FORMULARIO ORIGINAL (POR SI ACASO) ---
export const mostrarFormulario = (req, res) => {
    res.sendFile(path.join(__dirname, "../public/html/formVIJS.html"));
};

export const registrarUsuario = async (req, res) => {
    const datos = req.body;
    const resultado = await procesarRegistro(datos);
    res.json(resultado);
};
