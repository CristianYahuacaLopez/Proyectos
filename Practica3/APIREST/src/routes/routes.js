import { Router } from 'express';
import * as crud from '../controllers/usersMySQL.js';
import crudSQL from '../controllers/usersSQLServer.js'; // Importación limpia

const router = Router();
// ... resto de tus rutas
// --- Rutas GET ---
//router.get('/mysql/users', crud.getUsers);
router.get('/sqlserver/users', crudSQL.getUsers);
router.get('/sqlserver/users/:correo', crudSQL.findByEmail);

// --- Rutas POST ---
//router.post('/mysql/users', crud.registerUser);
router.post('/sqlserver/users', crudSQL.registerUser);
router.post('/sqlserver/users/update-password', crudSQL.updatePassword);

export default router;
