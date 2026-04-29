export const validateUser = (user) => {
  // Cambiamos 'preguntarc' por 'id_pregunta'
  const { nombre, correo, contrasena, id_pregunta, respuestarc } = user;

  if (!nombre || nombre.length < 2) throw new Error('Nombre inválido');
  if (!correo || !correo.includes('@')) throw new Error('Correo inválido');
  
  // El hash de bcrypt es largo, así que < 20 está bien
  if (!contrasena || contrasena.length < 20) throw new Error('Hash de contraseña inválido');

  // Validamos el campo que realmente se envía
  if (!id_pregunta) throw new Error('ID de pregunta de recuperación requerido');
  if (!respuestarc) throw new Error('Respuesta de recuperación requerida');
};