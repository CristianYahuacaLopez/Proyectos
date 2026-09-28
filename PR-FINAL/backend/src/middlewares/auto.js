import jwt from 'jsonwebtoken'; // Librería para manejar (crear y desencriptar) los JSON Web Tokens

// Verifica que el usuario tenga un token válido (Proceso de Autenticación)
export const verifyToken = (req, res, next) => {
  // El token viaja escondido en los "Headers" de la petición HTTP bajo la clave 'authorization'
  const token = req.headers['authorization'];
  
  // Si la petición llega sin token, bloqueamos el acceso con un código HTTP 403 (Prohibido)
  if (!token) return res.status(403).json({ message: 'No se envió token' });

  try {
    // Convención HTTP: El token suele llegar como "Bearer eyJh..."
    // split(" ")[1] separa la palabra "Bearer" y se queda solo con el token real.
    // jwt.verify() comprueba matemáticamente que el token no haya sido alterado usando tu JWT_SECRET
    const decoded = jwt.verify(token.split(" ")[1], process.env.JWT_SECRET);
    
    // Si la firma matemática es válida, extraemos los datos del token 
    // y los inyectamos en el objeto "req" para que el controlador final sepa quién hace la petición
    req.user = decoded; 
    
    // Función clave en los Middlewares: "next()" da luz verde para que Express continúe hacia la ruta solicitada
    next();
  } catch (error) {
    // Si el token fue manipulado, caducó, o es falso, atrapamos el error y devolvemos 401 (No Autorizado)
    return res.status(401).json({ message: 'Token inválido o expirado' });
  }
};

// Verifica si es Administrador (Proceso de Autorización)
export const verifyAdmin = (req, res, next) => {
  // Leemos el rol que "verifyToken" inyectó previamente en req.user
  if (req.user.nombre_rol !== 'Administrador') {
    // Si es un usuario normal, le bloqueamos el paso a las rutas críticas (403 Prohibido)
    return res.status(403).json({ message: 'Requiere rol de Administrador' });
  }
  // Si coincide con 'Administrador', damos luz verde.
  next();
};