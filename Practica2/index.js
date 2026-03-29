/* 
   Archivo principal que inicia el servidor.
   Responsabilidades:
     1. Configurar Express
     2. Leer variables de entorno
     3. Registrar middlewares
     4. Registrar rutas
     5. Servir archivos estáticos (assets)


  Se requiere configurar el proyecto nodeJS
  
  1. Iniciarlizar proyecto
     npm init -y ------ asigna valores por defecto en 
                 ------ la configuración de package.json

   2. Instalar dependencias para el proyecto: en este caso
      Express para el servidor HTTP para procesar peticiones
      a través de envíos POST y GET.

      npm install express

      npm install --save-dev nodemon

*/

import express from "express";
import path from "path"; 
import { fileURLToPath } from "url";


import formRoutes from "./routes/formRoutes.js"; 

const PORT = 3000;

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use("/", express.static(path.join(__dirname, "public")));

// Rutas
app.use("/", formRoutes); 

app.listen(PORT, () => { 
    console.log(`Servidor ejecutándose en http://localhost:${PORT}`); 
});