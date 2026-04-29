import path from "path";
import { fileURLToPath } from "url";
import { verificarUsuario, guardarNuevoUsuario, obtenerPreguntaPorCorreo, validarRespuestaRecuperacion, modificarPassword } from "../services/service.js"; 

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Muestra el login estático
export const mostrarLogin = (req, res) => {
    res.sendFile(path.join(__dirname, "../public/html/login.html"));
};

/**
 * Valida las credenciales, inicia la sesión y renderiza la bienvenida con EJS.
 */
export const validarLogin = async (req, res) => {
    const { correo, password } = req.body;
    try {
        const resultado = await verificarUsuario(correo, password);

        if (resultado.success) {
            // --- INTEGRACIÓN DE SESIONES ---
            // Guardamos la información del usuario en la sesión
            req.session.userId = resultado.data.id;
            req.session.nombre = resultado.data.nombre;
            req.session.correo = resultado.data.correo;

            // --- INTEGRACIÓN DE EJS ---
            // Renderizamos la vista dinámica pasando el nombre desde la BD
            //return res.render('pages/bienvenida', { nombre: resultado.data.nombre });
            return res.status(200).json({ success: true });
        } else {
            return res.status(401).json(resultado);
        }

    } catch (error) {
        console.error('Error en validarLogin:', error.message);
        return res.status(500).json({
            success: false,
            errors: { general: 'Error interno del servidor' }
        });
    }
};

/**
 * Cierra la sesión del usuario y limpia la cookie del servidor.
 */
export const logout = (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error("Error al cerrar sesión:", err);
            return res.status(500).send("No se pudo cerrar la sesión.");
        }
        res.redirect("/"); // Redirige al login
    });
};

// Muestra el formulario de registro estático
export const mostrarRegistro = (req, res) => {
    res.sendFile(path.join(__dirname, "../public/html/registro.html"));
};

export const crearCuenta = async (req, res) => {
    try {
        const { nombre, correo, password, preguntaSecreta, respuestaSecreta } = req.body;
        const resultado = await guardarNuevoUsuario({ 
            nombre, 
            correo, 
            password, 
            preguntaSecreta, 
            respuestaSecreta
        });
        
        if (resultado.success) {
            return res.status(201).json(resultado);
        } else {
            return res.status(400).json(resultado);
        }
    } catch (error) {
        console.error('Error en crearCuenta:', error);
        return res.status(500).json({ 
            success: false, 
            mensaje: "Error en el servidor" 
        });
    }
};

// --- MÉTODOS DE RECUPERACIÓN ---

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

export const verificarRecuperacion = async (req, res) => {
    const { correo, respuestaSecreta } = req.body;
    const resultado = await validarRespuestaRecuperacion(correo, respuestaSecreta);
    
    if (resultado.success) {
        res.status(200).json(resultado);
    } else {
        res.status(401).json(resultado); 
    }
};

export const mostrarCambiarPassword = (req, res) => {
    res.sendFile(path.join(__dirname, "../public/html/cambiarPassword.html"));
};

export const actualizarPassword = async (req, res) => {
    const { correo, password } = req.body;
    const resultado = await modificarPassword(correo, password);
    res.json(resultado);
};