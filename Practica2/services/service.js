/**
 * Encargo de la lógica de negocio
 * Responsabilidades:
 *  1. Procesar datos del formulario
 *  2. Guardar información
 *  3. Aplicar reglas de negocio
 *  4. Transformar datos
 */
//async -> funcion asyncrona

import { findUserByEmail , writeUser, readUsers, writeAllUsers} from "../models/model.js";
import bcrypt from "bcrypt"; 

export const verificarUsuario = async (datos) => {
    const usuario = await findUserByEmail(datos.correo);

    if (usuario) {
        const match = await bcrypt.compare(datos.password, usuario.password);
        
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
 
export const procesarRegistro = async (datos) => {
    console.log("Procesando registro en el servicio:", datos);
    return {
        success: true,
        mensaje: "Usuario guardado exitosamente"
    };
};

export const guardarNuevoUsuario = async (usuario) => {
    const regexSeguridad = /^(?=.*[0-9])(?=.*[+\-*]).{10,15}$/;

    if (!regexSeguridad.test(usuario.password)) {
        return {
            success: false,
            mensaje: "La contraseña no es segura: requiere 10 a 15 caracteres, un número y un signo (+, -, *)."
        };
    }

    const existe = await findUserByEmail(usuario.correo);
    if (existe) {
        return { success: false, mensaje: "Este correo ya está registrado." };
    }

    const saltRounds = 12;
    const hashedPass = await bcrypt.hash(usuario.password, saltRounds);
    const hashedRespuesta = await bcrypt.hash(usuario.respuestaSecreta, saltRounds);

    const nuevoRegistro = {
        nombre: usuario.nombre,
        correo: usuario.correo,
        password: hashedPass, 
        preguntarc: usuario.preguntaSecreta, 
        respuestarc: hashedRespuesta 
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

export const obtenerPreguntaPorCorreo = async (correo) => {
    const usuario = await findUserByEmail(correo);

    if (usuario) {
        return { success: true, pregunta: usuario.preguntarc };
    }
    return { success: false, mensaje: "Correo no encontrado" };
};

export const validarRespuestaRecuperacion = async (correo, respuestaSecreta) => {
    const usuario = await findUserByEmail(correo);

    if (usuario) {
        const match = await bcrypt.compare(respuestaSecreta, usuario.respuestarc);
        
        if (match) {
            return { 
                success: true, 
                mensaje: "¡Respuesta Correcta!", 
                password: usuario.password 
            };
        }
    }
    return { success: false, mensaje: "La respuesta de seguridad es incorrecta." }; 
};

export const modificarPassword = async (correo, nuevaPassword) => {
    const regexSeguridad = /^(?=.*[0-9])(?=.*[+\-*]).{10,15}$/;

    if (!regexSeguridad.test(nuevaPassword)) {
        return {
            success: false,
            mensaje: "La nueva contraseña no cumple con los requisitos de seguridad."
        };
    }

    const usuarios = await readUsers();
    const indice = usuarios.findIndex(u => u.correo.toLowerCase() === correo.toLowerCase());

    if (indice !== -1) {
        const saltRounds = 12;
        const hashedPass = await bcrypt.hash(nuevaPassword, saltRounds);
        
        usuarios[indice].password = hashedPass;
        await writeAllUsers(usuarios);
        
        return { success: true, mensaje: "Contraseña actualizada con éxito." };
    }
    return { success: false, mensaje: "Usuario no encontrado." };
};

