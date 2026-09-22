document.getElementById('formLogin').addEventListener('submit', async function(event) {
    event.preventDefault(); // Evita que la página recargue

    const correo = document.getElementById('correo').value;
    const contrasena = document.getElementById('contrasena').value;
    const errorDiv = document.getElementById('loginError');
    
    // Ocultamos el error por si había uno previo
    errorDiv.style.display = 'none';

    try {
        const respuesta = await fetch('http://localhost:5000/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ correo, contrasena })
        });

        const data = await respuesta.json();

        if (respuesta.ok) {
            // ¡EL PASE VIP! Guardamos el token en la memoria del navegador
            localStorage.setItem('jwt_token', data.token);
            localStorage.setItem('user_name', data.username);
            localStorage.setItem('user_rol', data.rol);
            
            // Redirigimos al panel de control (que haremos en el siguiente paso)
            window.location.href = 'panel.html'; 
        } else {
            // Si la contraseña está mal o el usuario no existe
            errorDiv.textContent = data.message || 'Credenciales incorrectas';
            errorDiv.style.display = 'block';
        }
    } catch (error) {
        errorDiv.textContent = 'Error al conectar con el servidor. Verifica que esté encendido.';
        errorDiv.style.display = 'block';
        console.error('Error de conexión:', error);
    }
});