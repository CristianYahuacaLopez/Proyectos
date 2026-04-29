import express from "express";
import cors from "cors"; // Instálalo con: npm install cors
import dotenv from "dotenv";
// Importamos el archivo routes.js que es el que existe en APIREST 
import router from "./routes/routes.js"; 

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors()); // Permite que el servidor 3000 hable con el 5000
app.use(express.json());

// CORRECCIÓN: Usamos la variable 'router' que acabamos de importar 
// Nota: En la API usualmente se usa un prefijo como /api
app.use("/api", router); 

app.listen(PORT, () => {
    console.log(`API corriendo en http://localhost:${PORT}`);
});