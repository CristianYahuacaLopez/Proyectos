/*
   rutas a acciones correspondientes a los 
   métodos HTTP POST y GET según correspondan 
   para las peticiones al servidor.

   En estas rutas se invocan a los controladores
   que son los encargados de procesar las 
   peticiones.
*/

//endpoints
import express from "express";
import { mostrarFormulario,registrarUsuario } from "../controllers/formControllers.js";

const router = express.Router(); //guarda direcciones URL relacionadas con formularios

router.get("/", mostrarFormulario); 
/* get es petición de solo lectura, "/" es la ruta raíz-> localhost:3000/, Express busca esta línea.
   ostrarFormulario: Es el "controlador". Express dice: "Ah, el usuario entró a /, 
   entonces voy a ejecutar lo que diga la función mostrarFormulario
*/
router.post("/registrarUsuario", registrarUsuario); //para registrar a un usuario
export default router;



