const form = document.getElementById("miFormulario");

const resultado = document.getElementById("resultado");

const campos = ["nombre","tel","correo"];

 

function validarCampo(id){

    const input = document.getElementById(id);

    const error = document.getElementById("error-"+id);

 

    if(!input || !error) return true;

 

    error.textContent = "";

    input.classList.remove("valido","invalido");

 

    /* campo obligatorio */

    if(input.required && input.validity.valueMissing){

        error.textContent = "Este campo es obligatorio";

        input.classList.add("invalido");

        return false;

    }

 

    /* pattern */

    if(input.validity.patternMismatch){

        const mensajes = {

            nombre: "El nombre solo debe contener letras",

            tel: "Debe iniciar con (52) y tener 10 dígitos"

        };

 

        error.textContent = mensajes[id] || "Formato inválido";

        input.classList.add("invalido");

        return false;

    }

 

    /* email */

    if(input.validity.typeMismatch){

        error.textContent = "Correo electrónico inválido";

        input.classList.add("invalido");

        return false;

    }

 

    input.classList.add("valido");

    return true;

}

 

/* eventos en inputs */

campos.forEach(id => {

    const input = document.getElementById(id);

 

    if(!input) return;

 

    input.addEventListener("blur", () => validarCampo(id));

    input.addEventListener("input", () => validarCampo(id));

 

});

 

/* submit */

form.addEventListener("submit", async function(e) {

    let valido = true;

      e.preventDefault();

    campos.forEach(id => {

        if (!validarCampo(id)) {

            valido = false;

        }

    });

 

    if (!valido) {

           return;

    }

 

    // crear objeto JS a partir de un FormData

    /*

      {

        atr1:valor,

        atr2:valor,

        ...

        atrn:valor

      }

    */

    const datos = Object.fromEntries(new FormData(form)); //encapsula todos los datos del formulario y  los almacena en datos

    /*AJAX -> permite a las aplicaciones comunicarse con el servidor de manera asincrona sin necesidad de recargar la página (XML) */

    const response = await fetch("/registrarUsuario", {  //fetch -> permite realizar peticiones asincronas
            method: "POST",
            headers: {

                "Content-Type": "application/json"
            },
            body: JSON.stringify(datos)

    });

    const resultadoServidor = await response.json(); 

    resultado.textContent = JSON.stringify(resultadoServidor, null, 2);


    /*

    localStorage.setItem("formDatos", JSON.stringify(datos));

 

    const datosGuardados = JSON.parse(localStorage.getItem("formDatos"));

    console.log(datosGuardados);

    */

});
