const form = document.getElementById("recuperarForm"); 
const btnCargar = document.getElementById("btnCargarPregunta");
const contenedorPregunta = document.getElementById("contenedor-pregunta");
const textoPregunta = document.getElementById("textoPregunta");
const btnRecuperar = document.getElementById("btnRecuperar");
const resultado = document.getElementById("resultado");

const campos = ["correo", "respuestaSecreta"];

/**
 * PASO 1: Buscar la pregunta asociada al correo
 */
btnCargar.addEventListener("click", async () => {
    const correoInput = document.getElementById("correo");
    
    // Validamos el correo antes de buscar
    if (!validarCampo("correo")) {
        alert("Por favor, ingresa un correo válido.");
        return;
    }

    try {
        const response = await fetch("/obtenerPregunta", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ correo: correoInput.value })
        });

        const data = await response.json();

        if (data.success) {
            // Si el correo existe, mostramos la pregunta y el campo de respuesta
            textoPregunta.textContent = data.pregunta;
            contenedorPregunta.style.display = "block";
            btnRecuperar.style.display = "block";
            resultado.textContent = ""; // Limpiamos errores previos
        } else {
            resultado.style.color = "#ff6b6b";
            resultado.textContent = data.mensaje;
        }
    }catch (error) {
        console.error("Error:", error);
        resultado.textContent = "Error de conexión al buscar el correo.";
    }
});

function validarCampo(id) {
    const input = document.getElementById(id);
    const error = document.getElementById("error-" + id);

    if (!input || !error) return true;

    error.textContent = "";
    input.classList.remove("valido", "invalido");

    if (input.required && input.validity.valueMissing) {
        error.textContent = "Este campo es obligatorio";
        input.classList.add("invalido");
        return false;
    }

    if (input.type === "email" && input.validity.typeMismatch) {
        error.textContent = "Correo electrónico inválido";
        input.classList.add("invalido");
        return false;
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
    e.preventDefault(); 
    let valido = true;

    campos.forEach(id => {
        if (!validarCampo(id)) {
            valido = false;
        }
    });

  
    if (!valido) return;

    const datos = Object.fromEntries(new FormData(form));
    const btnSubmit = form.querySelector(".btn-signin");

    btnSubmit.textContent = "Verificando...";
    btnSubmit.disabled = true;

    try {
        const response = await fetch("/verificarRespuesta", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(datos)
        });

        // ... dentro del evento del botón Ver Contraseña ...

    const resultadoServidor = await response.json();

    if (response.ok && resultadoServidor.success) {
    const modal = document.getElementById("modalConfirmacion");
    const btnContinuar = document.getElementById("btnIrACambiar");
    const correo = document.getElementById("correo").value;

    // 1. Mostramos nuestro modal personalizado
    modal.style.display = "flex";

    // 2. Programamos el botón del modal
    btnContinuar.onclick = () => {
        window.location.href = `/cambiarPassword?correo=${encodeURIComponent(correo)}`;
    };
}

    /*if (response.ok && resultadoServidor.success) {
    // CUADRO DE ÉXITO (El que ya tienes)
    resultado.innerHTML = `
        <div class="mensaje-exito">
            <p><strong>¡Respuesta Correcta!</strong></p>
            <p>¡Identidad confirmada!</p>
        </div>
    `;
        } else {
    // --- NUEVO: CUADRO DE ERROR ---
    resultado.innerHTML = `
        <div class="mensaje-error-box">
            <p><strong>¡Respuesta Incorrecta!</strong></p>
            <p>${resultadoServidor.mensaje || "La respuesta no coincide con nuestros registros."}</p>
        </div>
    `;
    
    // Opcional: Limpiar el campo de respuesta para que lo intenten de nuevo
    document.getElementById("respuestaSecreta").value = "";*/

    } catch (error) {
        console.error("Error en la petición:", error);
        resultado.style.color = "#ff6b6b";
        resultado.textContent = "Error de conexión con el servidor";
    } finally {
        btnSubmit.textContent = "Ver Contraseña";
        btnSubmit.disabled = false;
    }
});