const form = document.getElementById("registroForm"); 
const resultado = document.getElementById("resultado");

const campos = ["correo", "password", "confirmPassword"];

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

    const pass = document.getElementById("password").value;
    const confirm = document.getElementById("confirmPassword").value;
    const errorConfirm = document.getElementById("error-confirmPassword");

    if (pass !== confirm) {
        errorConfirm.textContent = "Las contraseñas no coinciden";
        document.getElementById("confirmPassword").classList.add("invalido");
        valido = false;
    }

    if (!valido) return;

    const datos = Object.fromEntries(new FormData(form));

    const btnSubmit = form.querySelector(".btn-signin");
    btnSubmit.textContent = "Registrando...";
    btnSubmit.disabled = true;

    try {
        const response = await fetch("/crearCuenta", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(datos)
        });

        const resultadoServidor = await response.json();

        if (response.ok) {
            resultado.style.color = "#2ecc71"; // Verde éxito
            resultado.textContent = resultadoServidor.mensaje;
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
        btnSubmit.textContent = "Registrarse";
        btnSubmit.disabled = false;
    }
});