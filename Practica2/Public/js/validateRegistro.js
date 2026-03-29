const form = document.getElementById("registroForm"); 
const resultado = document.getElementById("resultado");

const campos = ["nombre","correo", "password", "confirmPassword","preguntaSecreta", "respuestaSecreta"];

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

    if (id === "nombre") {
        const regexNombre = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;
        if (!regexNombre.test(input.value)) {
            error.textContent = "El nombre solo debe contener letras";
            input.classList.add("invalido");
            return false;
        }
    }

    if (input.type === "email" && input.validity.typeMismatch) {
        error.textContent = "Correo electrónico inválido";
        input.classList.add("invalido");
        return false;
    }

    if (id === "password") {
    const regexSeguridad = /^(?=.*[0-9])(?=.*[+\-*]).{10,15}$/;

    if (!regexSeguridad.test(input.value)) {
        error.textContent = "Debe tener entre 10 y 15 caracteres, un número y un signo (+, -, *)";
        input.classList.add("invalido"); 
        return false;
    }
    }

    if (id === "confirmPassword") {
        const passwordOriginal = document.getElementById("password").value;
        if (input.value !== passwordOriginal) {
            error.textContent = "Las contraseñas no coinciden";
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


if (response.ok && resultadoServidor.success) {
    const modal = document.getElementById("modalRegistroExito");
    const mensajeP = document.getElementById("modalMensaje");
    const tituloH2 = document.getElementById("modalTitulo");
    const btnLogin = document.getElementById("btnIrALogin");

    const nombreUsuario = document.getElementById("nombre").value;

    tituloH2.textContent = `¡Bienvenido, ${nombreUsuario}!`;
    mensajeP.textContent = "Tu cuenta ha sido creada y guardada correctamente en el sistema.";

    modal.style.display = "flex";

    btnLogin.onclick = () => {
        window.location.href = "/"; 
    };

    form.reset(); 
} else {
    resultado.style.color = "#ff6b6b";
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