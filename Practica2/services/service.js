/**
 * Encargo de la lógica de negocio
 * Responsabilidades:
 *  1. Procesar datos del formulario
 *  2. Guardar información
 *  3. Aplicar reglas de negocio
 *  4. Transformar datos
 */
//async -> funcion asyncrona

export const procesarRegistro = async (datos) => {
    // Aquí es donde "procesas" los datos (guardar en BD, validar, etc.)
    console.log("Datos recibidos en el servicio:", datos);
    
    // Retornamos un objeto para que el controlador sepa qué responder
    return {
        success: true,
        nombre: datos.nombre,
        telefono: datos.tel,
        email: datos.correo
    };
};