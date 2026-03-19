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
import { procesarRegistro } from "../services/service.js"; // Importas el servicio

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const mostrarFormulario = (req, res) => {
    res.sendFile(path.join(__dirname, "../public/html/formVIJS.html"));
};

//para procesar el envío del formulario
export const registrarUsuario = async (req, res) => {
    try{
         // Llamamos al servicio para que haga el trabajo pesado
        const resultado = await procesarRegistro(req.body); // Aquí llegan los datos del formulario
        //res.send(`¡Usuario ${resultado.nombre} registrado con éxito!`);
        res.status(200).json({
            ok:true,
            data:resultado
        });

    }catch(error){
        res.status(400).json({
            ok:false,
            mensaje:error.mensaje
        });
    }
   

    

    
};