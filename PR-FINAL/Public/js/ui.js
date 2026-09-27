// Aseguramos que el código se ejecute cuando el HTML esté listo
document.addEventListener('DOMContentLoaded', () => {
    
    // ==========================================
    // 1. AUTO-SELECCIÓN DE TRÁMITES DESDE LA URL
    // ==========================================
    const urlParams = new URLSearchParams(window.location.search);
    const tramiteSolicitado = urlParams.get('tramite');

    if (tramiteSolicitado) {
        // Buscamos todas las casillas de trámites en el formulario
        const casillasTramites = document.querySelectorAll('.chk-tramite');
        
        if (casillasTramites.length > 0) {
            // Primero desmarcamos todas por si acaso
            casillasTramites.forEach(chk => chk.checked = false);

            // Buscamos la casilla que coincida con el ID y la marcamos
            const casillaObjetivo = Array.from(casillasTramites).find(chk => chk.value === tramiteSolicitado);
            
            if (casillaObjetivo) {
                casillaObjetivo.checked = true;
            }
        }
    }

    // ==========================================
    // 2. LÓGICA DEL TEMA OSCURO/CLARO
    // ==========================================
    const btnTema = document.getElementById('btn-tema');
    const body = document.body;

    const temaGuardado = localStorage.getItem('lux_theme');

    if (temaGuardado === 'claro') {
        body.classList.add('modo-claro');
        if (btnTema) btnTema.textContent = '🌙'; 
    } else {
        if (btnTema) btnTema.textContent = '☀️'; 
    }

    if (btnTema) { 
        btnTema.addEventListener('click', () => {
            body.classList.toggle('modo-claro');
            
            if (body.classList.contains('modo-claro')) {
                btnTema.textContent = '🌙';
                localStorage.setItem('lux_theme', 'claro'); 
            } else {
                btnTema.textContent = '☀️';
                localStorage.setItem('lux_theme', 'oscuro'); 
            }
        });
    }
});

// Funciones para el Modal de Opciones de Cita en el inicio
function abrirModalOpciones() {
    const modal = document.getElementById('modalOpciones');
    if(modal) modal.style.display = 'flex';
}

function cerrarModalOpciones() {
    const modal = document.getElementById('modalOpciones');
    if(modal) modal.style.display = 'none';
}

// Validar y enviar Formulario de Compra
const formComprar = document.getElementById('formComprar');

if (formComprar) {
    // Detectar si el cliente viene del catálogo
    const urlParams = new URLSearchParams(window.location.search);
    const idInmuebleSolicitado = urlParams.get('inmueble');

    formComprar.addEventListener('submit', async (e) => {
        e.preventDefault(); 

        let formularioValido = true;
        
        // Si hay un inmueble en la URL, solo exigimos los datos personales
        let camposObligatorios = ['nombre', 'apellido', 'correo', 'telefono_principal'];
        
        // Si NO hay inmueble en la URL, exigimos también las preferencias de búsqueda
        if (!idInmuebleSolicitado) {
            camposObligatorios.push('interes_tipo', 'interes_municipio', 'presupuesto', 'forma_pago');
        }

        camposObligatorios.forEach(id => {
            const input = document.getElementById(id);
            if (!input) return; // Evitar errores si el HTML cambia
            
            const mensajeExistente = input.parentNode.querySelector('.error-text');

            if (!input.value.trim()) {
                input.classList.add('input-error');
                formularioValido = false;
                
                if (!mensajeExistente) {
                    const spanMensaje = document.createElement('span');
                    spanMensaje.className = 'error-text';
                    spanMensaje.innerText = '* Por favor, rellene este campo';
                    input.parentNode.insertBefore(spanMensaje, input.nextSibling);
                }
            } else {
                input.classList.remove('input-error');
                if (mensajeExistente) mensajeExistente.remove();
            }
        });

        if (!formularioValido) return; 

        const datosCompra = {
            nombre: document.getElementById('nombre').value,
            apellido: document.getElementById('apellido').value,
            correo: document.getElementById('correo').value,
            telefonoPrincipal: document.getElementById('telefono_principal').value,
            telefonoSecundario: document.getElementById('telefono_secundario').value || null,
            interesTipo: document.getElementById('interes_tipo').value || null,
            interesMunicipio: document.getElementById('interes_municipio').value || null,
            presupuesto: document.getElementById('presupuesto').value || null,
            formaPago: document.getElementById('forma_pago').value || null,
            idInmuebleDeseado: idInmuebleSolicitado || null // Mandamos el ID al backend
        };

        try {
            const response = await fetch('http://localhost:5000/api/comprar', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(datosCompra)
            });

            if (response.ok) {
                document.getElementById('modalExito').style.display = 'flex';
                formComprar.reset(); 
            } else {
                alert("Hubo un error al guardar tu solicitud.");
            }
        } catch (error) {
            console.error("Error de conexión:", error);
        }
    });
}

// Validar y enviar Formulario de Venta
const formVender = document.getElementById('formVender');

if (formVender) {
    formVender.addEventListener('submit', async (e) => {
        e.preventDefault(); 

        let formularioValido = true;
        
        const camposObligatorios = [
            'nombre', 'apellido', 'correo', 'telefono_principal', 
            'ubicacion', 'codigo_postal', 'id_municipio', 'id_tipo', 'id_estado_in'
        ];

        camposObligatorios.forEach(id => {
            const input = document.getElementById(id);
            const mensajeExistente = input.parentNode.querySelector('.error-text');

            if (!input.value.trim()) {
                input.classList.add('input-error');
                formularioValido = false;
                
                if (!mensajeExistente) {
                    const spanMensaje = document.createElement('span');
                    spanMensaje.className = 'error-text';
                    spanMensaje.innerText = '* Por favor, rellene este campo';
                    input.parentNode.insertBefore(spanMensaje, input.nextSibling);
                }
            } else {
                input.classList.remove('input-error');
                if (mensajeExistente) {
                    mensajeExistente.remove();
                }
            }
        });

        if (!formularioValido) return; 

        const datosVenta = {
            nombre: document.getElementById('nombre').value,
            apellido: document.getElementById('apellido').value,
            correo: document.getElementById('correo').value,
            telefonoPrincipal: document.getElementById('telefono_principal').value,
            telefonoSecundario: document.getElementById('telefono_secundario').value || null,
            ubicacion: document.getElementById('ubicacion').value,
            codigoPostal: document.getElementById('codigo_postal').value,
            idMunicipio: document.getElementById('id_municipio').value,
            idTipo: document.getElementById('id_tipo').value,
            idEstadoIn: document.getElementById('id_estado_in').value,
            vandalizada: document.getElementById('vandalizada').checked ? 1 : 0,
            invadida: document.getElementById('invadida').checked ? 1 : 0,
            creditoPendiente: document.getElementById('credito_pendiente').value || 0.00
        };

        try {
            const response = await fetch('http://localhost:5000/api/vender', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(datosVenta)
            });

            if (response.ok) {
                document.getElementById('modalExito').style.display = 'flex';
                formVender.reset(); 
            } else {
                alert("Hubo un error al guardar tu solicitud.");
            }
        } catch (error) {
            console.error("🚨 Error de conexión:", error);
        }
    });
}

// Validar y enviar Formulario de Trámites
const formTramite = document.getElementById('formTramite');

if (formTramite) {
    formTramite.addEventListener('submit', async (e) => {
        e.preventDefault();

        let formularioValido = true;
        
        const camposObligatorios = [
            'nombre', 'apellido', 'correo', 'telefono_principal', 'id_municipio'
        ];

        camposObligatorios.forEach(id => {
            const input = document.getElementById(id);
            const mensajeExistente = input.parentNode.querySelector('.error-text');

            if (!input.value.trim()) {
                input.classList.add('input-error');
                formularioValido = false;
                
                if (!mensajeExistente) {
                    const spanMensaje = document.createElement('span');
                    spanMensaje.className = 'error-text';
                    spanMensaje.innerText = '* Por favor, rellene este campo';
                    input.parentNode.insertBefore(spanMensaje, input.nextSibling);
                }
            } else {
                input.classList.remove('input-error');
                if (mensajeExistente) {
                    mensajeExistente.remove();
                }
            }
        });

        let serviciosSeleccionados = Array.from(document.querySelectorAll('.chk-servicio:checked')).map(cb => cb.value);
        let tramitesSeleccionados = Array.from(document.querySelectorAll('.chk-tramite:checked')).map(cb => cb.value);
        
        const toggleExtras = document.getElementById('toggle_extras');
        const seccionSecundaria = document.getElementById('seccion_secundaria');
        
        if (toggleExtras && !toggleExtras.checked && seccionSecundaria) {
            const casillasOcultas = Array.from(seccionSecundaria.querySelectorAll('input[type="checkbox"]:checked'));
            
            casillasOcultas.forEach(chk => {
                if (chk.classList.contains('chk-servicio')) {
                    serviciosSeleccionados = serviciosSeleccionados.filter(val => val !== chk.value);
                }
                if (chk.classList.contains('chk-tramite')) {
                    tramitesSeleccionados = tramitesSeleccionados.filter(val => val !== chk.value);
                }
            });
        }

        const contenedorValidacion = document.getElementById('contenedor_primario');
        const mensajeCheckbox = contenedorValidacion.querySelector('.error-text-checkbox');

        if (serviciosSeleccionados.length === 0 && tramitesSeleccionados.length === 0) {
            formularioValido = false;
            if (!mensajeCheckbox) {
                const spanMensajeCb = document.createElement('span');
                spanMensajeCb.className = 'error-text-checkbox';
                spanMensajeCb.innerText = '* Debe seleccionar al menos un servicio o trámite';
                contenedorValidacion.appendChild(spanMensajeCb);
            }
        } else {
             if (mensajeCheckbox) {
                 mensajeCheckbox.remove();
             }
        }

        if (!formularioValido) return;

        const datosTramite = {
            nombre: document.getElementById('nombre').value,
            apellido: document.getElementById('apellido').value,
            correo: document.getElementById('correo').value,
            telefonoPrincipal: document.getElementById('telefono_principal').value,
            telefonoSecundario: document.getElementById('telefono_secundario').value || null,
            idMunicipio: document.getElementById('id_municipio').value,
            ubicacionTramite: document.getElementById('ubicacion_tramite').value || null,
            servicios: serviciosSeleccionados,
            tramites: tramitesSeleccionados
        };

        try {
            const response = await fetch('http://localhost:5000/api/tramite', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(datosTramite)
            });

            if (response.ok) {
                document.getElementById('modalExito').style.display = 'flex';
                formTramite.reset();
            } else {
                alert("Hubo un error al guardar tu solicitud.");
            }
        } catch (error) {
            console.error("🚨 Error de conexión:", error);
        }
    });
}