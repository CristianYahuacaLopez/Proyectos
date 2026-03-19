const form = document.getElementById("loginForm"); // Coincide con el id de tu login.html
const resultado = document.getElementById("resultado");

// Campos específicos del login
const campos = ["correo", "password", "confirmPassword"];

function validarCampo(id) {
    const input = document.getElementById(id);
    const error = document.getElementById("error-" + id);

    if (!input || !error) return true;

    error.textContent = "";
    input.classList.remove("valido", "invalido");

    /* 1. Validación: Campo obligatorio */
    if (input.required && input.validity.valueMissing) {
        error.textContent = "Este campo es obligatorio";
        input.classList.add("invalido");
        return false;
    }

    /* 2. Validación: Formato de correo */
    if (input.type === "email" && input.validity.typeMismatch) {
        error.textContent = "Correo electrónico inválido";
        input.classList.add("invalido");
        return false;
    }

    input.classList.add("valido");
    return true;
}

/* Eventos para validar mientras el usuario escribe */
campos.forEach(id => {
    const input = document.getElementById(id);
    if (!input) return;

    input.addEventListener("blur", () => validarCampo(id));
    input.addEventListener("input", () => validarCampo(id));
});

/* Evento principal del botón Ingresar */
form.addEventListener("submit", async function(e) {
    e.preventDefault(); // Evita que la página se recargue
    let valido = true;

    // Validamos todos los campos uno por uno
    campos.forEach(id => {
        if (!validarCampo(id)) {
            valido = false;
        }
    });

    // 3. Validación extra: ¿Las contraseñas son iguales?
    const pass = document.getElementById("password").value;
    const confirm = document.getElementById("confirmPassword").value;
    const errorConfirm = document.getElementById("error-confirmPassword");

    if (pass !== confirm) {
        errorConfirm.textContent = "Las contraseñas no coinciden";
        document.getElementById("confirmPassword").classList.add("invalido");
        valido = false;
    }

    if (!valido) return;

    // Si todo está bien, preparamos los datos en formato JSON
    const datos = Object.fromEntries(new FormData(form));

    try {
        // Enviamos a la ruta de validarLogin definida en formRoutes.js
        const response = await fetch("/validarLogin", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(datos)
        });

        const resultadoServidor = await response.json();

        // Mostramos el mensaje de éxito o error en el <pre id="resultado">
        if (response.ok) {
            resultado.style.color = "#2ecc71"; // Verde éxito
            resultado.textContent = resultadoServidor.mensaje;
        } else {
            resultado.style.color = "#ff6b6b"; // Rojo error
            resultado.textContent = resultadoServidor.mensaje;
        }

    } catch (error) {
        console.error("Error en la petición:", error);
        resultado.textContent = "Error de conexión con el servidor";
    }
});