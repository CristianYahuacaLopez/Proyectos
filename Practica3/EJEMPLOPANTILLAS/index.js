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
import session from "express-session";
import path from "path"; 
import { fileURLToPath } from "url";
import formRoutes from "./routes/formRoutes.js"; 

const PORT = 3000;
const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 1. Configuración de vistas (EJS)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// 2. Middlewares de sesión y procesamiento
app.use(session({
    secret: 'DistriCorp_Secret_Key', 
    resave: false,
    saveUninitialized: false,
    cookie: { 
        maxAge: 3600000, 
        secure: false   
    }
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/", express.static(path.join(__dirname, "public")));

// 3. Definición del Middleware de Autenticación
const isAuthenticated = (req, res, next) => {
    // Verificamos si existe el ID de usuario en la sesión
    if (req.session.userId) {
        return next(); 
    }
    res.redirect("/"); // Si no hay sesión, redirigir al login
};

// 4. Rutas protegidas y generales
// CORRECCIÓN: Usamos 'app' en lugar de 'router'
app.get("/bienvenida", isAuthenticated, (req, res) => {
    res.render("pages/bienvenida", { nombre: req.session.nombre });
});

app.use("/", formRoutes); 

// 5. El servidor escucha al final
app.listen(PORT, () => { 
    console.log(`Servidor ejecutándose en http://localhost:${PORT}`); 
});