const form = document.getElementById("loginForm");
const resultado = document.getElementById("resultado");
const campos = ["correo", "password"];

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

    if (id === "correo") {
        const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
        if (!regexEmail.test(input.value)) {
            error.textContent = "Correo Inválido";
            input.classList.add("invalido");
            return false;
        }
    }

    if (id === "password") {
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

form.addEventListener("submit", async (e)=> {
    e.preventDefault();
    /*let valido = true;
    
    campos.forEach(id => {
        if (!validarCampo(id)) {
            valido = false;
        }
    });*/
//form.addEventListener("submit", (event) => {
    let valido = true;
  
    campos.forEach(id => {
        //const input = document.getElementById(id);
        if (!validarCampo(id)) {
            valido = false;
        }
    });

    if (!valido){
        console.log("Formulario con errores.");
        return;
    }
    
    //const datos = Object.fromEntries(new FormData(form));
    const formData = new FormData(form);
    const datos = Object.fromEntries(formData.entries());
    console.log("antes de validarlogin");
    
    try {
        const response = await fetch("/validarLogin", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(datos)
        });

        /*if (response.redirected) {
            window.location.href = response.url;
            return;
        }*/

        //const resultadoServidor = await response.json();

        if (response.ok) {
            /*const card = document.querySelector(".glass-card");
            card.innerHTML = `
                <div style="text-align: center; padding: 20px;">
                    <h2 style="color: #00d4ff;">¡Bienvenido, ${resultadoServidor.nombre}!</h2>
                    <p style="color: white; margin-top: 15px;">Has iniciado sesión correctamente en el sistema.</p>
                    <br>
                    <button onclick="location.reload()" class="btn-signin">Cerrar Sesión</button>
                </div>
            `;*/
            window.location.href = "/bienvenida";
        } else {
            const resultado = await response.json();
            const modalErr = document.getElementById("modalError");
            const mensajeP = document.getElementById("mensajeErrorModal");
            const btnCerrar = document.getElementById("btnCerrarError");

            mensajeP.textContent = resultado.errors?.general || resultado.errors?.correo || resultado.errors?.contrasena || "Datos incorrectos";
            modalErr.style.display = "flex";

            document.getElementById("btnCerrarError").onclick = () => {
                modalErr.style.display = "none";
                //document.getElementById("password").focus();
            };
        }

    } catch (error) {
        console.error("Error en la petición:", error);
        const modalErr = document.getElementById("modalError");
        document.getElementById("mensajeErrorModal").textContent = "Error de conexión con el servidor.";
        modalErr.style.display = "flex";
        
        document.getElementById("btnCerrarError").onclick = () => {
            modalErr.style.display = "none";
        };
    }
});