import express from 'express'; // El framework principal para crear el servidor web y manejar peticiones HTTP
import dotenv from 'dotenv'; // Herramienta para cargar variables secretas (como contraseñas) desde el archivo .env
import cors from 'cors'; // Middleware de seguridad: Control de Acceso HTTP 
import usersRoutes from './routes/routes.js'; // Importa el archivo donde definimos todas las URLs de la API

dotenv.config(); // Ejecuta dotenv para que las variables secretas estén disponibles en "process.env"

const app = express(); // Instancia la aplicación principal del servidor. Es el "motor" del backend

app.use(cors()); // Permite que el frontend se conecte a este servidor sin ser bloqueado
app.use(express.json()); // Middleware crucial Permite que el servidor entienda el body de las peticiones en formato JSON
app.use('/api', usersRoutes); // Monta todas las rutas bajo el prefijo "/api" 

const PORT = process.env.PORT || 5000; // Define el puerto. Usa el del archivo .env, o el 5000 por defecto

app.listen(PORT, () => {
  // Enciende el servidor y lo pone a "escuchar" peticiones entrantes
  console.log(`Server running on port ${PORT}`);
});