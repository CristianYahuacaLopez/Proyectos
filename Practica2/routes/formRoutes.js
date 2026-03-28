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
import { mostrarLogin, validarLogin, mostrarRegistro, crearCuenta, mostrarRecuperar, 
   getPregunta, verificarRecuperacion,mostrarCambiarPassword,actualizarPassword } from "../controllers/formControllers.js";

const router = express.Router();

// Rutas para el Login
router.get("/", mostrarLogin); 
router.post("/validarLogin", validarLogin); 

//Rutas de Registro
router.get("/registro", mostrarRegistro);
router.post("/crearCuenta", crearCuenta);

//Rutas para recuperación
router.get("/recuperarForm", mostrarRecuperar);
router.post("/obtenerPregunta", getPregunta);
router.post("/verificarRespuesta", verificarRecuperacion);

//para nuevacontraseña
router.get("/cambiarPassword", mostrarCambiarPassword);
router.post("/actualizarPassword", actualizarPassword);


export default router; 

