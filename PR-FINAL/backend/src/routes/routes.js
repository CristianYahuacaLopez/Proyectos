import { Router } from 'express'; // Importa la herramienta de Express para organizar y definir las URLs de la API
import * as crudSQL from '../controllers/usersSQLServer.js'; // Importa la lógica de negocio relacionada con los usuarios (login, registro)
import * as formSQL from '../controllers/formulariosController.js'; // Importa la lógica que guarda los datos de los formularios en la base de datos
import { verifyToken } from '../middlewares/auto.js'; // Importa el "cadenero" o barrera de seguridad que revisará el Token JWT

const router = Router(); // Inicia el enrutador donde definiremos los "endpoints" o puntos de acceso

// RUTA PÚBLICA 
// Son de acceso libre. Usamos el método HTTP "POST" porque el frontend enviará datos "ocultos" en el body de la petición
router.post('/login', crudSQL.login);
router.post('/register', crudSQL.register);
router.post('/comprar', formSQL.registrarCompra); 
router.post('/vender', formSQL.registrarVenta); 
router.post('/tramite', formSQL.registrarTramite);

// RUTAS PROTEGIDAS 
// "verifyToken" se pone en medio. Si pasa la prueba, Express continúa hacia el controlador (crudSQL.getUsers)
router.get('/sqlserver/users', verifyToken, crudSQL.getUsers); // GET: Solicita lectura de datos al servidor
router.delete('/sqlserver/users/:id', verifyToken, crudSQL.deleteUser); // DELETE: Solicita eliminar un recurso 
router.put('/sqlserver/users/:id', verifyToken, crudSQL.editUser); // PUT: Solicita actualizar un recurso existente

export default router; // Exporta todas estas rutas empaquetadas para que index.js las asocie al prefijo "/api"