const form = document.getElementById("cambioPasswordForm");
const modal = document.getElementById("modalExito");

const urlParams = new URLSearchParams(window.location.search);
const correoUrl = urlParams.get('correo');
if (correoUrl) {
    document.getElementById("correo").value = correoUrl;
}

function validarCampo(id) {
    const input = document.getElementById(id);
    const error = document.getElementById("error-" + id);
    if (!input || !error) return true;

    error.textContent = "";
    input.classList.remove("valido", "invalido");

    if (id === "password") {
        const regexSeguridad = /^(?=.*[0-9])(?=.*[+\-*]).{10,15}$/;
        if (!regexSeguridad.test(input.value)) {
            error.textContent = "Debe tener 10-15 caracteres, un número y signo (+, -, *)";
            input.classList.add("invalido");
            return false;
        }
    }

    if (id === "confirmPassword") {
        const original = document.getElementById("password").value;
        if (input.value !== original) {
            error.textContent = "Las contraseñas no coinciden";
            input.classList.add("invalido");
            return false;
        }
    }

    input.classList.add("valido");
    return true;
}

["password", "confirmPassword"].forEach(id => {
    const el = document.getElementById(id);
    el.addEventListener("input", () => validarCampo(id));
});

form.addEventListener("submit", async (e) => {
    e.preventDefault();
    
    if (!validarCampo("password") || !validarCampo("confirmPassword")) return;

    const datos = Object.fromEntries(new FormData(form));

    try {
        const response = await fetch("/actualizarPassword", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(datos)
        });

        const res = await response.json();

        if (res.success) {
            modal.style.display = "flex"; 
            document.getElementById("btnRegresar").onclick = () => window.location.href = "/";
        } else {
            alert("Error: " + res.mensaje);
        }
    } catch (error) {
        alert("Error de conexión");
    }
});