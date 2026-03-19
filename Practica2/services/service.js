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
    // Aquí es donde "procesas" los datos (guardar en BD, validar, etc.)
    console.log("Datos recibidos en el servicio:", datos);
    
    const usuarioDB = {
        correo: "yare@telematica.com",
        password: "123"
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

// Mantenemos el de registro por si lo sigues usando
export const procesarRegistro = async (datos) => {
    console.log("Procesando registro en el servicio:", datos);
    return {
        success: true,
        mensaje: "Usuario guardado exitosamente"
    };
};

/**
 * Servicio para registrar nuevos usuarios
 * El correo funciona como ID único.
 */
export const guardarNuevoUsuario = async (usuario) => {
    // 1. Aquí ponemos el AWAIT.
    // Simulamos que la base de datos tarda 1.5 segundos en procesar
    await new Promise(resolve => setTimeout(resolve, 1500));

    // En un proyecto real con MongoDB o MySQL, aquí escribirías algo como:
    // await db.usuarios.insert(usuario);

    console.log("--- Proceso de Guardado Finalizado ---");
    console.log(`ID (Correo): ${usuario.id}`);
    console.log(`Password Guardada: ${usuario.password}`);

    return {
        success: true,
        mensaje: "¡Usuario creado con éxito! Ya puedes usar tu correo para entrar."
    };
};
