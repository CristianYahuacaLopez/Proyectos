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
// Importamos las funciones del servicio (asegúrate de que los nombres coincidan)
import { procesarRegistro, verificarUsuario } from "../services/service.js"; 

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// --- CONTROLADORES PARA REGISTRO ---
export const mostrarFormulario = (req, res) => {
    res.sendFile(path.join(__dirname, "../public/html/formVIJS.html"));
};

export const registrarUsuario = async (req, res) => {
    const datos = req.body;
    const resultado = await procesarRegistro(datos);
    res.json(resultado);
};

// --- CONTROLADORES PARA LOGIN (ESTOS SON LOS QUE TE FALTAN) ---

// Esta es la función que te marca el error de "mostrarLogin"
export const mostrarLogin = (req, res) => {
    res.sendFile(path.join(__dirname, "../public/html/login.html"));
};

// Esta es la función para procesar el inicio de sesión
export const validarLogin = async (req, res) => {
    const datos = req.body;
    
    // Llamamos a la lógica del servicio
    const resultado = await verificarUsuario(datos);
    
    if (resultado.success) {
        res.status(200).json(resultado);
    } else {
        res.status(401).json(resultado);
    }
};