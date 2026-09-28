// Escucha el evento 'submit' (cuando el usuario hace clic en el botón de ingresar)
document.getElementById('formLogin').addEventListener('submit', async function(event) {
    
    // Bloquea el comportamiento nativo de HTML que recargaría toda la página
    event.preventDefault(); 

    // Extrae los valores (texto) que el usuario escribió en las cajas de texto
    const correo = document.getElementById('correo').value;
    const contrasena = document.getElementById('contrasena').value;
    const errorDiv = document.getElementById('loginError');
    
    // Ocultamos el error por si había uno previo de un intento fallido anterior
    errorDiv.style.display = 'none';

    try {
        // Ejecuta la petición HTTP POST asíncrona hacia tu servidor backend
        const respuesta = await fetch('https://backup-gossip-version.ngrok-free.dev/api/login', {
            method: 'POST', // Usamos POST porque estamos enviando credenciales sensibles
            headers: { 
                'Content-Type': 'application/json', // Le decimos al servidor que lea el paquete como JSON
                'ngrok-skip-browser-warning': 'true'
            },
            body: JSON.stringify({ correo, contrasena }) // Convierte las variables a una cadena de texto JSON
        });

        // Espera a que el servidor conteste y traduce la respuesta de vuelta a un objeto JavaScript
        const data = await respuesta.json();

        // respuesta.ok es true si el código de estado HTTP es 200-299 
        if (respuesta.ok) {
            //  Guardamos el token en la memoria del navegador
            // localStorage asegura que los datos no se borren aunque el usuario cierre la pestaña
            localStorage.setItem('jwt_token', data.token);
            localStorage.setItem('user_name', data.username);
            localStorage.setItem('user_rol', data.rol);
            
            // Redirigimos al panel de control 
            // Como el token ya está en localStorage, panel.html podrá leerlo para saber quién entró
            window.location.href = 'panel.html'; 
        } else {
            // Si la contraseña está mal o el usuario no existe (códigos 401, 404)
            // data.message viene directamente del 'res.status(401).json({ message: ... })' del backend
            errorDiv.textContent = data.message || 'Credenciales incorrectas';
            errorDiv.style.display = 'block'; // Hace visible la alerta roja
        }
    } catch (error) {
        // Este bloque atrapa errores catastróficos de red 
        errorDiv.textContent = 'Error al conectar con el servidor. Verifica que esté encendido.';
        errorDiv.style.display = 'block';
        console.error('Error de conexión:', error);
    }
});