// Aseguramos que el código se ejecute cuando el HTML esté listo
document.addEventListener('DOMContentLoaded', () => {
    
    const btnTema = document.getElementById('btn-tema');
    const body = document.body;

    // 1. REVISAR LA MEMORIA AL CARGAR LA PÁGINA
    // Buscamos si ya existe una preferencia guardada con el nombre 'lux_theme'
    const temaGuardado = localStorage.getItem('lux_theme');

    // Si la memoria dice 'claro', le ponemos la clase al body inmediatamente
    if (temaGuardado === 'claro') {
        body.classList.add('modo-claro');
        if (btnTema) btnTema.textContent = '🌙'; // Ponemos la luna
    } else {
        // Si no hay nada o dice 'oscuro', lo dejamos normal (oscuro)
        if (btnTema) btnTema.textContent = '☀️'; // Ponemos el sol
    }

    // 2. QUÉ HACER CUANDO LE DAN CLIC AL BOTÓN
    if (btnTema) { // Verificamos que el botón exista en la página actual
        btnTema.addEventListener('click', () => {
            // Alternamos la clase visualmente
            body.classList.toggle('modo-claro');
            
            // Verificamos en qué modo quedó y lo GUARDAMOS en localStorage
            if (body.classList.contains('modo-claro')) {
                btnTema.textContent = '🌙';
                localStorage.setItem('lux_theme', 'claro'); // Guardar como claro
            } else {
                btnTema.textContent = '☀️';
                localStorage.setItem('lux_theme', 'oscuro'); // Guardar como oscuro
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
    formComprar.addEventListener('submit', async (e) => {
        e.preventDefault(); 

        let formularioValido = true;
        
        const camposObligatorios = [
            'nombre', 'apellido', 'correo', 'telefono_principal', 
            'interes_tipo', 'interes_municipio', 'presupuesto', 'forma_pago'
        ];

        camposObligatorios.forEach(id => {
            const input = document.getElementById(id);
            
            // Buscamos si ya le habíamos puesto un mensaje de error antes
            const mensajeExistente = input.parentNode.querySelector('.error-text');

            if (!input.value.trim()) {
                input.classList.add('input-error');
                formularioValido = false;
                
                // Si está vacío y no tiene el mensaje, se lo creamos
                if (!mensajeExistente) {
                    const spanMensaje = document.createElement('span');
                    spanMensaje.className = 'error-text';
                    spanMensaje.innerText = '* Por favor, rellene este campo';
                    // Lo insertamos justo debajo del input
                    input.parentNode.insertBefore(spanMensaje, input.nextSibling);
                }
            } else {
                // Si el campo ya tiene texto, le quitamos el borde rojo
                input.classList.remove('input-error');
                
                // Y borramos el mensajito si existía
                if (mensajeExistente) {
                    mensajeExistente.remove();
                }
            }
        });

        if (!formularioValido) {
            return; 
        }

        const datosCompra = {
            nombre: document.getElementById('nombre').value,
            apellido: document.getElementById('apellido').value,
            correo: document.getElementById('correo').value,
            telefonoPrincipal: document.getElementById('telefono_principal').value,
            telefonoSecundario: document.getElementById('telefono_secundario').value || null,
            interesTipo: document.getElementById('interes_tipo').value,
            interesMunicipio: document.getElementById('interes_municipio').value,
            presupuesto: document.getElementById('presupuesto').value,
            formaPago: document.getElementById('forma_pago').value
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
        
        // Excluimos telefono_secundario, vandalizada, invadida y credito_pendiente
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

        // Empacamos los datos
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
        
        // Ahora exigimos el municipio en la validación roja
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

        // Validar que eligiera al menos una casilla
        const serviciosSeleccionados = Array.from(document.querySelectorAll('.chk-servicio:checked')).map(cb => cb.value);
        const tramitesSeleccionados = Array.from(document.querySelectorAll('.chk-tramite:checked')).map(cb => cb.value);
        const contenedorServicios = document.getElementById('servicios-container');
        const mensajeCheckbox = contenedorServicios.querySelector('.error-text-checkbox');

        if (serviciosSeleccionados.length === 0 && tramitesSeleccionados.length === 0) {
            formularioValido = false;
            if (!mensajeCheckbox) {
                const spanMensajeCb = document.createElement('span');
                spanMensajeCb.className = 'error-text-checkbox';
                spanMensajeCb.innerText = '* Debe seleccionar al menos un servicio o trámite';
                contenedorServicios.appendChild(spanMensajeCb);
            }
        } else {
             if (mensajeCheckbox) {
                 mensajeCheckbox.remove();
             }
        }

        if (!formularioValido) return;

        // Empacamos los datos
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

