const form = document.getElementById("loginForm"); 
const resultado = document.getElementById("resultado");

const campos = ["correo", "password"];

function validarCampo(id) {
    const input = document.getElementById(id);
    const error = document.getElementById("error-" + id);

    if (!input || !error) return true;

    error.textContent = "";
    input.classList.remove("valido", "invalido");

    /* Validación: Campo obligatorio */
    if (input.required && input.validity.valueMissing) {
        error.textContent = "Este campo es obligatorio";
        input.classList.add("invalido");
        return false;
    }

    /* Validación: Formato de correo */
    if (id === "correo") {
    const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    if (!regexEmail.test(input.value)) {
        error.textContent = "Correo Invalido";
        input.classList.add("invalido");
        return false;
        }
    }

    if (id === "password") {
    // La misma regla: entre 10 y 15 caracteres, un número y un signo (+, -, *)
    const regexSeguridad = /^(?=.*[0-9])(?=.*[+\-*]).{10,15}$/;

    if (!regexSeguridad.test(input.value)) {
        error.textContent = "Debe tener entre 10 y 15 caracteres, un número y un signo (+, -, *)";
        input.classList.add("invalido");
        return false;
    }
}

    input.classList.add("valido");
    return true;

}


campos.forEach(id => {
    const input = document.getElementById(id);
    if (!input) return;

    input.addEventListener("blur", () => validarCampo(id));
    input.addEventListener("input", () => validarCampo(id));
});


form.addEventListener("submit", async function(e) {
    e.preventDefault(); // Evita que la página se recargue
    let valido = true;

    // Validamos todos los campos uno por uno
    campos.forEach(id => {
        if (!validarCampo(id)) {
            valido = false;
        }
    });

    if (!valido) return;

    const datos = Object.fromEntries(new FormData(form));

    try {
        const response = await fetch("/validarLogin", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(datos)
        });

        const resultadoServidor = await response.json();

        if (response.ok && resultadoServidor.success) {
            // --- CAMBIO 1: PANTALLA DE BIENVENIDA ---
            // Buscamos el contenedor principal para rediseñarlo dinámicamente
            const card = document.querySelector(".glass-card");
            
            card.innerHTML = `
                <div style="text-align: center; padding: 20px;">
                    <h2 style="color: #2ecc71;">¡Bienvenido, ${resultadoServidor.nombre}!</h2>
                    <p style="color: white; margin-top: 15px;">Has iniciado sesión correctamente en el sistema.</p>
                    <br>
                    <button onclick="location.reload()" class="btn-signin">Cerrar Sesión</button>
                </div>
            `;
        } else {
            // --- CAMBIO 2: VENTANA ALERT ---
            alert("Error: " + (resultadoServidor.mensaje || "El usuario no existe"));
            
            // Opcional: También podrías limpiar el password por seguridad
            document.getElementById("password").value = "";
        }

    } catch (error) {
        console.error("Error en la petición:", error);
        alert("Error de conexión con el servidor");
    }
});
    