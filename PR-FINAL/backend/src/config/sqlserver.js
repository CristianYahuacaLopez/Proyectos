import sql from 'mssql'; // Importa el paquete (driver) que sabe cómo hablar el idioma de SQL Server
import dotenv from 'dotenv'; // Herramienta para cargar variables secretas desde el archivo oculto (.env)
dotenv.config(); // Inicializa dotenv para que las variables estén listas para usarse


// Este objeto guarda las "llaves" de la base de datos
export const sqlServerConfig = {
  // process.env extrae los valores sin dejarlos escritos en el código fuente
  user: process.env.SQLSERVER_USER, 
  password: process.env.SQLSERVER_PASSWORD,
  server: process.env.SQLSERVER_SERVER,
  database: process.env.SQLSERVER_DB,
  options: {
    encrypt: false, // En entornos locales (localhost) suele ir en false porque no tenemos certificados SSL instalados
    trustServerCertificate: true, // Le dice a Node.js que confíe en la base de datos local sin pedir un certificado de seguridad oficial
  },
};

/*export const getConnection = async () => {
  try {
    return await sql.connect(sqlServerConfig);
  } catch (error) {
    console.error('SQL Server connection error:', error);
  }
};*/

// src/config/sqlserver.js
export const getConnection = async () => {
  try {
    //console.log("Espiando credenciales:", sqlServerConfig);
    
    // Es mejor usar un pool global para no abrir conexiones infinitas
    // sql.connect abre el "puente" de comunicación con la base de datos usando las credenciales de arriba
    const pool = await sql.connect(sqlServerConfig);
    
    return pool; // Devuelve el puente abierto para que los controladores envíen sus queries
  } catch (error) {
    // Si la contraseña está mal o el servidor de SQL está apagado, el código cae aquí
    console.error('¡ERROR CRÍTICO! No se pudo conectar a SQL Server:', error.message);
    throw error; // Lanzar el error (throw) avisa al controlador (como formulariosController) que la conexión falló, para que le avise al frontend con un error 500
  }
};