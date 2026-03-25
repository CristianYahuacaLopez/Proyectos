/**
 * Encargo de la lógica de negocio
 * Responsabilidades:
 *  1. Procesar datos del formulario
 *  2. Guardar información
 *  3. Aplicar reglas de negocio
 *  4. Transformar datos
 */
//async -> funcion asyncrona

import { findUserByEmail , writeUser} from "../models/model.js";
import bcrypt from "bcrypt"; // Necesario para comparar hashes

export const verificarUsuario = async (datos) => {
    const usuario = await findUserByEmail(datos.correo);

    if (usuario) {
        // Comparamos la contraseña plana contra el hash del JSON
        const match = await bcrypt.compare(datos.password, usuario.contrasena);
        
        if (match) {
            return { 
                success: true, 
                mensaje: `¡Bienvenido, ${usuario.nombre}!`, 
                nombre: usuario.nombre 
            };
        }
    }
    
    return { success: false, mensaje: "El usuario no existe o los datos son incorrectos." };
};

// Mantenemos el de registro 
export const procesarRegistro = async (datos) => {
    console.log("Procesando registro en el servicio:", datos);
    return {
        success: true,
        mensaje: "Usuario guardado exitosamente"
    };
};

/**
 * Servicio para registrar nuevos usuarios
 */
export const guardarNuevoUsuario = async (usuario) => {
    const regexSeguridad = /^(?=.*[0-9])(?=.*[+\-*]).{10,15}$/;

    if (!regexSeguridad.test(usuario.password)) {
        return {
            success: false,
            mensaje: "La contraseña no es segura: requiere 10 a 15 caracteres, un número y un signo (+, -, *)."
        };
    }

    // Verificar si el correo ya existe para no duplicar
    const existe = await findUserByEmail(usuario.correo);
    if (existe) {
        return { success: false, mensaje: "Este correo ya está registrado." };
    }

    const saltRounds = 12;
    const hashedPass = await bcrypt.hash(usuario.password, saltRounds);
    const hashedRespuesta = await bcrypt.hash(usuario.respuestaSecreta, saltRounds);

    //Mapear a la estructura exacta de tu users.json
    const nuevoRegistro = {
        nombre: usuario.nombre,
        correo: usuario.correo,
        password: hashedPass, // Mapeo: password -> contrasena
        preguntarc: usuario.preguntaSecreta, // Mapeo: preguntaSecreta -> preguntarc
        respuestarc: hashedRespuesta // Mapeo: respuestaSecreta -> respuestarc
    };

    const guardadoExitoso = await writeUser(nuevoRegistro);

    if (guardadoExitoso) {
        return {
            success: true,
            mensaje: `Registro exitoso ${usuario.nombre}! Tu cuenta ha sido creada y guardada.`
        };
    } else {
        return {
            success: false,
            mensaje: "Hubo un error al intentar guardar los datos en el sistema."
        };
    }

    console.log("--- Iniciando Registro de Nuevo Usuario ---");
    console.log(`Nombre: ${usuario.nombre}`);
    console.log(`Correo: ${usuario.correo}`);
    console.log(`Pregunta Secreta: ${usuario.preguntaSecreta}`);
    console.log(`Respuesta Secreta: ${usuario.respuestaSecreta}`);
    console.log("-------------------------------------------");

};


//para recuperar contraseña
export const obtenerPreguntaPorCorreo = async (correo) => {
    // Buscamos en el JSON real
    const usuario = await findUserByEmail(correo);

    if (usuario) {
        // En tu JSON el campo se llama 'preguntarc'
        return { success: true, pregunta: usuario.preguntarc };
    }
    return { success: false, mensaje: "Correo no encontrado en el archivo JSON." };
};


/* Archivo: services/service.js */
export const validarRespuestaRecuperacion = async (correo, respuestaSecreta) => {
    // 1. Buscamos al usuario real en el JSON
    const usuario = await findUserByEmail(correo);

    if (usuario) {
        // 2. Comparamos la respuesta (si usas hashes, usa bcrypt.compare)
        // Si en tu JSON el campo es 'respuestarc', úsalo aquí
        const match = await bcrypt.compare(respuestaSecreta, usuario.respuestarc);
        
        if (match) {
            return { 
                success: true, 
                mensaje: "¡Respuesta Correcta!", 
                password: usuario.contrasena 
            };
        }
    }
    return { success: false, mensaje: "La respuesta de seguridad es incorrecta." }; 
};



