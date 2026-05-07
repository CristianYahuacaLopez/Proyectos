export const validateUser = (user) => {
  const { nombre, correo, contrasena, id_pregunta, respuestarc } = user;

  if (!nombre || nombre.length < 2) throw new Error('Nombre inválido');
  if (!correo || !correo.includes('@')) throw new Error('Correo inválido');
  
  if (!contrasena || contrasena.length < 20) throw new Error('Hash de contraseña inválido');

  if (!id_pregunta) throw new Error('ID de pregunta de recuperación requerido');
  if (!respuestarc) throw new Error('Respuesta de recuperación requerida');
};