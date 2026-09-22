// src/middlewares/auto.js
import jwt from 'jsonwebtoken';

// Verifica que el usuario tenga un token válido
export const verifyToken = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) return res.status(403).json({ message: 'No se envió token' });

  try {
    const decoded = jwt.verify(token.split(" ")[1], process.env.JWT_SECRET);
    req.user = decoded; // Guardamos los datos del usuario en la petición
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Token inválido o expirado' });
  }
};

// Verifica si es Administrador
export const verifyAdmin = (req, res, next) => {
  if (req.user.nombre_rol !== 'Administrador') {
    return res.status(403).json({ message: 'Requiere rol de Administrador' });
  }
  next();
};