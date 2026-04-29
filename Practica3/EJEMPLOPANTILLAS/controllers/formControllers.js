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
import { verificarUsuario, guardarNuevoUsuario, obtenerPreguntaPorCorreo, validarRespuestaRecuperacion, modificarPassword } from "../services/service.js"; 

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const mostrarLogin = (req, res) => {
    res.sendFile(path.join(__dirname, "../public/html/login.html"));
};

//modificar
export const validarLogin = async (req, res) => {
    const { correo, password } = req.body;
    /*if (resultado.success) {
        res.status(200).json(resultado);
    } else {
        res.status(401).json(resultado); // 401 si no existe o falla
    }*/
   try{
    console.log('Inciando validacion para:',correo)

    const resultado = await verificarUsuario(correo,password);

    if(resultado.success){
        console.log('Login exitoso, renderizando bienvenida...');
         // Renderizar la vista
        res.render('pages/bienvenida',{ nombre: resultado.data.nombre })
    }else{
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

export const showWelcome = (req, res) => {
    // path.resolve construye la ruta al archivo HTML
    const filePath = path.resolve('public', 'html', 'bienvenida.html');
    
    // Enviamos el archivo
    res.sendFile(filePath);
};

export const showRecovery = (req, res) => {

};


//para nuevo registro
export const mostrarRegistro = (req, res) => {
    res.sendFile(path.join(__dirname, "../public/html/registro.html"));
};

export const crearCuenta = async (req, res) => {
  try{
    const {nombre, correo, password, preguntaSecreta, respuestaSecreta } = req.body;
        const resultado = await guardarNuevoUsuario({ 
            nombre, 
            correo, 
            password, 
            preguntaSecreta, 
            respuestaSecreta
        });
        if (resultado.success) {
            // 201 significa "Creado"
            return res.status(201).json(resultado);
        } else {
            // 400 si hubo un error de validación o el usuario ya existe
            return res.status(400).json(resultado);
        }
  }catch(error){
    console.error('Error en crearCuenta:', error);
        return res.status(500).json({ 
            success: false, 
            mensaje: "Error en el servidor" 
        });
    }
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

// valida la respuesta y entrega el JSON con la contraseña
export const verificarRecuperacion = async (req, res) => {
    const { correo, respuestaSecreta } = req.body;
    const resultado = await validarRespuestaRecuperacion(correo, respuestaSecreta);
    
    if (resultado.success) {
        res.status(200).json(resultado);
    } else {
        res.status(401).json(resultado); 
    }
};

//para nueva contraseña
export const mostrarCambiarPassword = (req, res) => {
    res.sendFile(path.join(__dirname, "../public/html/cambiarPassword.html"));
};

// También asegúrate de exportar la que procesa el cambio
export const actualizarPassword = async (req, res) => {
    const { correo, password } = req.body;
    const resultado = await modificarPassword(correo, password);
    res.json(resultado);
};
