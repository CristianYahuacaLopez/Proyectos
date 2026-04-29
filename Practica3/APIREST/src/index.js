import express from 'express';
import dotenv from 'dotenv';
import usersRoutes from './routes/routes.js';

dotenv.config();

const app = express();

app.use(express.json());
app.use('/api', usersRoutes); //asocia rutas conocidas

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});