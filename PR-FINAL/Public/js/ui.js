// Aseguramos que el código se ejecute cuando el HTML esté listo
document.addEventListener('DOMContentLoaded', () => {
    
    const btnTema = document.getElementById('btn-tema');
    const body = document.body;

    // 1. REVISAR LA MEMORIA AL CARGAR LA PÁGINA
    // Buscamos si ya existe una preferencia guardada con el nombre 'lux_theme'
    const temaGuardado = localStorage.getItem('lux_theme');

    // Si la memoria dice 'claro', le ponemos la clase al body inmediatamente
    if (temaGuardado === 'claro') {
        body.classList.add('modo-claro');
        if (btnTema) btnTema.textContent = '🌙'; // Ponemos la luna
    } else {
        // Si no hay nada o dice 'oscuro', lo dejamos normal (oscuro)
        if (btnTema) btnTema.textContent = '☀️'; // Ponemos el sol
    }

    // 2. QUÉ HACER CUANDO LE DAN CLIC AL BOTÓN
    if (btnTema) { // Verificamos que el botón exista en la página actual
        btnTema.addEventListener('click', () => {
            // Alternamos la clase visualmente
            body.classList.toggle('modo-claro');
            
            // Verificamos en qué modo quedó y lo GUARDAMOS en localStorage
            if (body.classList.contains('modo-claro')) {
                btnTema.textContent = '🌙';
                localStorage.setItem('lux_theme', 'claro'); // Guardar como claro
            } else {
                btnTema.textContent = '☀️';
                localStorage.setItem('lux_theme', 'oscuro'); // Guardar como oscuro
            }
        });
    }
});