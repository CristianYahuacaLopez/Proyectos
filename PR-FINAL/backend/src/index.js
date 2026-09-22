import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors'; // <-- NUEVO
import usersRoutes from './routes/routes.js';

dotenv.config();

const app = express();

app.use(cors()); // <-- NUEVO: Permite que el frontend se conecte
app.use(express.json());
app.use('/api', usersRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});