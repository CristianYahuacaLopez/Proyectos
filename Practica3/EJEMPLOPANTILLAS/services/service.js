/**
 * Encargo de la lógica de negocio
 * Responsabilidades:
 *  1. Procesar datos del formulario
 *  2. Guardar información
 *  3. Aplicar reglas de negocio
 *  4. Transformar datos
 */
//async -> funcion asyncrona

import { response } from "express";
import { findUserByEmail , writeUser, readUsers, writeAllUsers} from "../models/model.js";
import bcrypt from "bcrypt"; 

export const verificarUsuario = async (correo, contrasena) => {
//export const verificarUsuario = async (datos) => {
    //const usuario = await findUserByEmail(datos.correo);
    
    //recupera el correo a partir de la BD
    try{
        const response = await fetch(`http://localhost:5000/api/sqlserver/users/${correo}`);
        console.log(response)

    if(!response.ok){
        throw new Error(`Error en la petición: ${response.status}`);
    }
    const datos = await response.json();
    const usuario = datos[0];
    console.log(usuario);

    /*if (usuario) {
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
};*/
     if (!usuario) {
          return ({
              success: false,
              errors: { correo: 'Usuario no encontrado' }              
          }); 
      }

      const match = await bcrypt.compare(contrasena, usuario.contrasena);

      if (!match) {
        return ({
          success: false,
          errors: { contrasena: 'Contraseña incorrecta' }
        });
      }

      return ({
        success: true,
        errors: null,
        data: usuario
      });

    } catch(err){
       console.error(err);
       return ({
          success: false,
          errors: { general: 'Error del servidor' }
       });
    }  

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

    /*const existe = await findUserByEmail(usuario.correo);
    if (existe) {
        return { success: false, mensaje: "Este correo ya está registrado." };
    }*/
    try{
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

    //const guardadoExitoso = await writeUser(nuevoRegistro);
    const guardadoExitoso = await fetch('http://localhost:5000/sqlserver/users', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(nuevoRegistro)
    });

    if (guardadoExitoso.ok) {
        const data = await guardadoExitoso.json();
        return {
            success: true,
            mensaje: `Registro exitoso UD de usuario: ${data.id||''} Tu cuenta ha sido creada y guardada.`
        };
    } else {
        return {
            success: false,
            mensaje: "Hubo un error al intentar guardar los datos en la base de datos."
            };
        }
    }catch(error){
        console.error("Error en la conexión0", error);
        return { success: false, mensaje: "No se pudo conectar con el servidor de base de datos." };
        }
};

   /* console.log("--- Iniciando Registro de Nuevo Usuario ---");
    console.log(`Nombre: ${usuario.nombre}`);
    console.log(`Correo: ${usuario.correo}`);
    console.log(`Pregunta Secreta: ${usuario.preguntaSecreta}`);
    console.log(`Respuesta Secreta: ${usuario.respuestaSecreta}`);
    console.log("-------------------------------------------");*/



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

