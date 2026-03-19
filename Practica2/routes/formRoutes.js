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
import { mostrarFormulario, registrarUsuario, mostrarLogin, validarLogin } from "../controllers/formControllers.js";

const router = express.Router();

// Rutas para el Login
router.get("/login", mostrarLogin); // Descomentado para que funcione
router.post("/validarLogin", validarLogin); // Cambiado para que use el controlador correcto

export default router; 



