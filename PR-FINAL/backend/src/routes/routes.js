import { Router } from 'express';
import * as crudSQL from '../controllers/usersSQLServer.js';
import { verifyToken } from '../middlewares/auto.js';

const router = Router();

// RUTA PÚBLICA (No requiere token)
router.post('/login', crudSQL.login);
router.post('/register', crudSQL.register);

// RUTAS PROTEGIDAS (Requieren Token JWT)
// Obtener todos los usuarios para el tablero
router.get('/sqlserver/users', verifyToken, crudSQL.getUsers);

// Eliminar usuario (Lógico) - El controlador valida los roles
router.delete('/sqlserver/users/:id', verifyToken, crudSQL.deleteUser);

router.put('/sqlserver/users/:id', verifyToken, crudSQL.editUser);

// Ruta para registrar (No requiere token)
router.post('/register', crudSQL.register);

export default router;

