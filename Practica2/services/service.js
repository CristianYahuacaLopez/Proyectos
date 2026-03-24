/**
 * Encargo de la lógica de negocio
 * Responsabilidades:
 *  1. Procesar datos del formulario
 *  2. Guardar información
 *  3. Aplicar reglas de negocio
 *  4. Transformar datos
 */
//async -> funcion asyncrona

export const verificarUsuario = async (datos) => {
    console.log("Datos recibidos en el servicio:", datos);
    
    const usuarioDB = {
        nombre: "Yaretzi",
        correo: "yare@telematica.com",
        password: "Yaretzi2905+",
        preguntaSecreta: "¿Nombre de tu primera mascota?", // Lo que verá el usuario
        respuestaSecreta: "kishi"
    };

    if (datos.correo === usuarioDB.correo && datos.password === usuarioDB.password) {
        return {
            success: true,
            mensaje: "¡Acceso concedido!",
            usuario: datos.correo
        };
    } else {
        return {
            success: false,
            mensaje: "Correo o contraseña incorrectos"
        };
    }
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

    console.log("--- Iniciando Registro de Nuevo Usuario ---");
    console.log(`Nombre: ${usuario.nombre}`);
    console.log(`Correo: ${usuario.correo}`);
    console.log(`Pregunta Secreta: ${usuario.preguntaSecreta}`);
    console.log(`Respuesta Secreta: ${usuario.respuestaSecreta}`);
    console.log("-------------------------------------------");
    
    return {
        success: true,
        mensaje: "Usuario creado con éxito"
    };
};


//para recuperar contraseña
export const obtenerPreguntaPorCorreo = async (correo) => {
    const usuarioDB = {
        correo: "yare@telematica.com",
        preguntaSecreta: "¿Nombre de tu primera mascota?"
    };

    if (correo === usuarioDB.correo) {
        return { success: true, pregunta: usuarioDB.preguntaSecreta };
    }
    return { success: false, mensaje: "Correo no encontrado." };
};


export const validarRespuestaRecuperacion = async (correo, respuestaSecreta) => {
   const usuarioDB = {
        correo: "yare@telematica.com",
        respuestaSecreta: "kishi",
        password: "Yaretzi2905+"
    };

    if (correo === usuarioDB.correo && respuestaSecreta.toLowerCase() === usuarioDB.respuestaSecreta.toLowerCase()) {
        return { 
            success: true, 
            mensaje: "¡Respuesta Correcta!", 
            password: usuarioDB.password 
        };
    }
    return { success: false, mensaje: "Respuesta incorrecta." }; 
};