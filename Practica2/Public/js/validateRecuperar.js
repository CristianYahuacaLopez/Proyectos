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

        const resultadoServidor = await response.json();

        if (response.ok && resultadoServidor.success) {
            resultado.style.color = "#2ecc71"; // Verde éxito
            //resultado.textContent = resultadoServidor.mensaje;
            resultado.textContent = JSON.stringify(resultadoServidor, null, 2);
            form.reset(); // Limpiamos el formulario después de registrar
        } else {
            resultado.style.color = "#ff6b6b"; // Rojo error
            resultado.textContent = resultadoServidor.mensaje;
        }

    } catch (error) {
        console.error("Error en la petición:", error);
        resultado.style.color = "#ff6b6b";
        resultado.textContent = "Error de conexión con el servidor";
    } finally {
        btnSubmit.textContent = "Ver Contraseña";
        btnSubmit.disabled = false;
    }
});