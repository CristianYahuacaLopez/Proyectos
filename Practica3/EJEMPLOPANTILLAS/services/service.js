import bcrypt from "bcrypt"; 

const API_URL = 'http://localhost:5000/api/sqlserver/users';

/**
 * Verifica las credenciales del usuario consultando la API de SQL Server.
 */
export const verificarUsuario = async (correo, contrasena) => {
    try {
        const response = await fetch(`${API_URL}/${correo}`);
        if (!response.ok) throw new Error(`Error: ${response.status}`);
        
        const datos = await response.json();
        const usuario = datos[0];

        if (!usuario) {
            return { success: false, errors: { correo: 'Usuario no encontrado' } }; 
        }

        const match = await bcrypt.compare(contrasena, usuario.contrasena);
        if (!match) {
            return { success: false, errors: { contrasena: 'Contraseña incorrecta' } };
        }

        return { success: true, data: usuario };
    } catch (err) {
        console.error("Error en verificarUsuario:", err);
        return { success: false, errors: { general: 'Error de conexión con la BD' } };
    }
};

/**
 * Registra un nuevo usuario enviando los datos hasheados a la API.
 */
export const guardarNuevoUsuario = async (usuario) => {
    const regexSeguridad = /^(?=.*[0-9])(?=.*[+\-*]).{10,15}$/;
    if (!regexSeguridad.test(usuario.password)) {
        return { success: false, mensaje: "La contraseña no cumple los requisitos de seguridad." };
    }

    try {
        const saltRounds = 12;
        const hashedPass = await bcrypt.hash(usuario.password, saltRounds);
        const hashedRespuesta = await bcrypt.hash(usuario.respuestaSecreta, saltRounds);

        const nuevoRegistro = {
            nombre: usuario.nombre,
            correo: usuario.correo,
            contrasena: hashedPass, 
            id_pregunta: usuario.preguntaSecreta, 
            respuestarc: hashedRespuesta
        };

        const res = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(nuevoRegistro)
        });

        if (res.ok) {
            const data = await res.json();
            return { success: true, mensaje: `Registro exitoso. ID: ${data.id || ''}` };
        }
        return { success: false, mensaje: "Error al guardar en la base de datos." };
    } catch (error) {
        return { success: false, mensaje: "No se pudo conectar con el servidor de BD." };
    }
};

/**
 * Obtiene la pregunta secreta desde la base de datos.
 */
export const obtenerPreguntaPorCorreo = async (correo) => {
    try {
        const response = await fetch(`${API_URL}/${correo}`);
        const datos = await response.json();
        const usuario = datos[0];

        if (usuario) {
            // Nota: Asegúrate de que tu API devuelva el texto de la pregunta o el ID
            return { success: true, pregunta: usuario.pregunta }; 
        }
        return { success: false, mensaje: "Correo no encontrado" };
    } catch (error) {
        return { success: false, mensaje: "Error al obtener la pregunta" };
    }
};

/**
 * Valida la respuesta de recuperación comparando el hash.
 */
export const validarRespuestaRecuperacion = async (correo, respuestaSecreta) => {
    try {
        const response = await fetch(`${API_URL}/${correo}`);
        const datos = await response.json();
        const usuario = datos[0];

        if (usuario) {
            const match = await bcrypt.compare(respuestaSecreta, usuario.respuestarc);
            if (match) return { success: true, mensaje: "Identidad confirmada" };
        }
        return { success: false, mensaje: "Respuesta incorrecta" };
    } catch (error) {
        return { success: false, mensaje: "Error de validación" };
    }
};

/**
 * Actualiza la contraseña en la base de datos (Requiere implementar un endpoint PUT/PATCH en tu API).
 */
export const modificarPassword = async (correo, nuevaPassword) => {
    const regexSeguridad = /^(?=.*[0-9])(?=.*[+\-*]).{10,15}$/;
    if (!regexSeguridad.test(nuevaPassword)) {
        return { success: false, mensaje: "Contraseña no segura" };
    }

    try {
        const hashedPass = await bcrypt.hash(nuevaPassword, 12);
        const res = await fetch(`${API_URL}/update-password`, {
            method: 'POST', 
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ correo, contrasena: hashedPass })
        });

        if (res.ok) {
            return { success: true, mensaje: "Contraseña actualizada" };
        } else {
            const errorData = await res.json();
            return { success: false, mensaje: errorData.mensaje || "Error en la API" };
        }
    } catch (error) {
        return { success: false, mensaje: "No se pudo conectar con la API" };
    }
};