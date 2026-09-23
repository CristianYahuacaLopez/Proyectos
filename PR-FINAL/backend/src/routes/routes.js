import { Router } from 'express';
import * as crudSQL from '../controllers/usersSQLServer.js';
import * as formSQL from '../controllers/formulariosController.js'; // <-- Nuevo import
import { verifyToken } from '../middlewares/auto.js';

const router = Router();

// RUTA PÚBLICA (No requiere token)
router.post('/login', crudSQL.login);
router.post('/register', crudSQL.register);
router.post('/comprar', formSQL.registrarCompra); // <-- Nueva ruta del formulario
router.post('/vender', formSQL.registrarVenta); // <-- Nueva ruta
router.post('/tramite', formSQL.registrarTramite);

// RUTAS PROTEGIDAS (Requieren Token JWT)
router.get('/sqlserver/users', verifyToken, crudSQL.getUsers);
router.delete('/sqlserver/users/:id', verifyToken, crudSQL.deleteUser);
router.put('/sqlserver/users/:id', verifyToken, crudSQL.editUser);

export default router;