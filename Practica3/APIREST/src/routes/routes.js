import { Router } from 'express';
import * as crud from '../controllers/usersMySQL.js';
import crudSQL from '../controllers/usersSQLServer.js'; 

const router = Router();

router.get('/sqlserver/users', crudSQL.getUsers);
router.get('/sqlserver/users/:correo', crudSQL.findByEmail);

router.post('/sqlserver/users', crudSQL.registerUser);
router.post('/sqlserver/users/update-password', crudSQL.updatePassword);

export default router;
