// Funciones globales para que los botones de HTML las encuentren siempre
// Al agregarlas al objeto 'window', nos aseguramos de que puedan ser llamadas desde cualquier etiqueta <button onclick="...">
window.abrirModalOpciones = function() {
    const modal = document.getElementById('modalOpciones');
    if(modal) modal.style.display = 'flex';
};

window.cerrarModalOpciones = function() {
    const modal = document.getElementById('modalOpciones');
    if(modal) modal.style.display = 'none';
};

// Todo el cerebro de la aplicación encapsulado en una función para evitar que el código se ejecute antes de que el HTML termine de cargar
function initLuxHouseUI() {
    
    // 1. (Dark/Light Mode)
    const btnTema = document.getElementById('btn-tema');
    const body = document.body;
    
    // Leemos la memoria del navegador (localStorage) para ver si el usuario ya había elegido el modo claro en el pasado
    if (localStorage.getItem('lux_theme') === 'claro') {
        body.classList.add('modo-claro');
        if (btnTema) btnTema.textContent = '🌙';
    } else {
        if (btnTema) btnTema.textContent = '☀️';
    }

    if (btnTema) {
        btnTema.addEventListener('click', () => {
            body.classList.toggle('modo-claro'); // Intercambia la clase CSS
            if (body.classList.contains('modo-claro')) {
                btnTema.textContent = '🌙';
                localStorage.setItem('lux_theme', 'claro'); // Guarda la preferencia en el navegador
            } else {
                btnTema.textContent = '☀️';
                localStorage.setItem('lux_theme', 'oscuro');
            }
        });
    }

    // 2. MODO INTELIGENTE PARA tramite.html
    const formTramite = document.getElementById('formTramite');
    if (formTramite) {
        
        // Buscamos si el usuario llegó aquí desde un botón específico (URL) o si el dato se guardó en memoria al hacer clic en las tarjetas
        const urlParams = new URLSearchParams(window.location.search);
        const servicioSolicitado = urlParams.get('servicio') || localStorage.getItem('lxh_servicio');
        const tramiteSolicitado = urlParams.get('tramite') || localStorage.getItem('lxh_tramite');

        // Limpiamos la memoria para que, si el usuario refresca la página, el formulario vuelva a su estado normal (vacío)
        localStorage.removeItem('lxh_servicio');
        localStorage.removeItem('lxh_tramite');

        const toggleExtras = document.getElementById('toggle_extras');
        const seccionSecundaria = document.getElementById('seccion_secundaria');
        const contenedorUbicacion = document.getElementById('contenedor_ubicacion');
        
        const checkboxesServicios = document.querySelectorAll('.chk-servicio');
        const checkboxesTramites = document.querySelectorAll('.chk-tramite');

        // Referencias al DOM (Document Object Model) para modificar los textos visuales
        const tituloFormulario = document.getElementById('titulo_formulario');
        const subtituloFormulario = document.getElementById('subtitulo_formulario');
        const tituloPrimario = document.getElementById('titulo_primario');
        const descPrimaria = document.getElementById('desc_primaria');
        const labelToggle = document.getElementById('label_toggle');
        const descSecundaria = document.getElementById('desc_secundaria');
        
        const contenedorPrimario = document.getElementById('contenedor_primario');
        const contenedorSecundario = document.getElementById('contenedor_secundario');
        const bloqueServicios = document.getElementById('bloque_servicios');
        const bloqueTramites = document.getElementById('bloque_tramites');

        let modoActual = 'servicios'; // Modo por defecto

        // Objeto de conocimiento: Relaciona qué trámites van con qué servicio
        const relaciones = {
            'srv_compra_part': ['trm_general', 'trm_notarial'],
            'srv_venta_part': ['trm_general', 'trm_hipoteca'],
            'srv_infonavit': ['trm_general', 'trm_notarial', 'trm_poderes'],
            'srv_contado': ['trm_notarial']
        };

        const mapaTramites = { '1': 'trm_general', '2': 'trm_hipoteca', '3': 'trm_poderes', '4': 'trm_notarial' };

        // Función que evalúa si algún trámite seleccionado requiere que el usuario ingrese su dirección
        const evaluarMostrarUbicacion = () => {
            let necesitaDireccion = false;
            checkboxesTramites.forEach(chk => {
                if (chk.checked && (chk.id === 'trm_hipoteca' || chk.id === 'trm_notarial')) {
                    necesitaDireccion = true;
                }
            });
            if(contenedorUbicacion) contenedorUbicacion.style.display = necesitaDireccion ? 'block' : 'none';
        };

        // Función de Autoseleccion de checkboxes según el servicio elegido
        const recalcularTramitesRecomendados = () => {
            if (modoActual === 'servicios') {
                const algunServicioMarcado = Array.from(checkboxesServicios).some(chk => chk.checked);
                if (algunServicioMarcado) {
                    checkboxesTramites.forEach(trm => trm.checked = false); // Resetea primero
                    checkboxesServicios.forEach(chk => {
                        if (chk.checked && relaciones[chk.id]) {
                            relaciones[chk.id].forEach(idTramite => {
                                const trmCheckbox = document.getElementById(idTramite);
                                if (trmCheckbox) trmCheckbox.checked = true; // Marca las coincidencias
                            });
                        }
                    });
                }
            }
            evaluarMostrarUbicacion();
        };

        // Escuchadores de Eventos (Event Listeners): Disparan acciones cuando el usuario hace clic
        if(toggleExtras) {
            toggleExtras.addEventListener('change', function() {
                seccionSecundaria.style.display = this.checked ? 'block' : 'none';
                if (this.checked && modoActual === 'servicios') recalcularTramitesRecomendados();
            });
        }

        checkboxesServicios.forEach(chk => chk.addEventListener('change', recalcularTramitesRecomendados));
        checkboxesTramites.forEach(chk => chk.addEventListener('change', evaluarMostrarUbicacion));

        // Prioridad Trámites (Si el usuario viene de la página tramites.html)
        if (tramiteSolicitado && !servicioSolicitado) {
            modoActual = 'tramites';
            
            // Cambia los textos para que tengan sentido con el contexto de trámites
            tituloFormulario.innerText = 'Gestoría y Trámites';
            subtituloFormulario.innerText = 'Selecciona los trámites legales que requieres. Nosotros prepararemos tu expediente.';
            tituloPrimario.innerText = 'Trámites Principales';
            descPrimaria.innerText = 'Selecciona los trámites que requieres iniciar:';
            labelToggle.innerText = '¿Deseas asociar este trámite a un servicio inmobiliario?';
            descSecundaria.innerText = 'Opcional: Selecciona el servicio inmobiliario relacionado a tu trámite:';

            // Mueve el bloque de Trámites arriba y el de Servicios abajo
            contenedorPrimario.appendChild(bloqueTramites);
            contenedorSecundario.appendChild(bloqueServicios);

            const idRealTramite = mapaTramites[tramiteSolicitado] || tramiteSolicitado;
            const chkObj = document.getElementById(idRealTramite);
            if (chkObj) {
                chkObj.checked = true;
                chkObj.dispatchEvent(new Event('change')); // Fuerza a que se ejecute la lógica de evaluación
            }
        } 
        // Prioridad Servicios (Si el usuario viene de la página servicios.html)
        else if (servicioSolicitado) {
            const chkObj = document.getElementById(servicioSolicitado);
            if (chkObj) {
                chkObj.checked = true;
                chkObj.dispatchEvent(new Event('change'));
            }
        }

        // Validación al Enviar Trámite (Evita que se envíen datos en blanco al backend)
        formTramite.addEventListener('submit', async (e) => {
            e.preventDefault(); // Evita que la página se recargue (comportamiento por defecto de HTML)
            
            let formularioValido = true;
            const camposObligatorios = ['nombre', 'apellido', 'correo', 'telefono_principal', 'id_municipio'];

            camposObligatorios.forEach(id => {
                const input = document.getElementById(id);
                if (!input) return;
                const mensajeExistente = input.parentNode.querySelector('.error-text');

                // Si el campo está vacío, le agrega clases de CSS rojas y un mensaje
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

            // Recolección de datos
            let serviciosSeleccionados = Array.from(document.querySelectorAll('.chk-servicio:checked')).map(cb => cb.value);
            let tramitesSeleccionados = Array.from(document.querySelectorAll('.chk-tramite:checked')).map(cb => cb.value);

            // Regla de seguridad visual: Si la sección extra está cerrada, no enviamos lo que esté seleccionado adentro
            if (toggleExtras && !toggleExtras.checked && seccionSecundaria) {
                const casillasOcultas = Array.from(seccionSecundaria.querySelectorAll('input[type="checkbox"]:checked'));
                casillasOcultas.forEach(chk => {
                    if (chk.classList.contains('chk-servicio')) serviciosSeleccionados = serviciosSeleccionados.filter(val => val !== chk.value);
                    if (chk.classList.contains('chk-tramite')) tramitesSeleccionados = tramitesSeleccionados.filter(val => val !== chk.value);
                });
            }

            const mensajeCheckbox = contenedorPrimario.querySelector('.error-text-checkbox');
            if (serviciosSeleccionados.length === 0 && tramitesSeleccionados.length === 0) {
                formularioValido = false;
                if (!mensajeCheckbox) {
                    const spanMensajeCb = document.createElement('span');
                    spanMensajeCb.className = 'error-text-checkbox';
                    spanMensajeCb.innerText = '* Debe seleccionar al menos un servicio o trámite';
                    contenedorPrimario.appendChild(spanMensajeCb);
                }
            } else {
                if (mensajeCheckbox) mensajeCheckbox.remove();
            }

            if (!formularioValido) return; // Si algo falló, se detiene aquí y no habla con el servidor.

            // Objeto (JSON) listo para viajar por la red
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
                // Comunicación asíncrona con el servidor Backend
                const response = await fetch('https://backup-gossip-version.ngrok-free.dev/api/tramite', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' }, // Avisa que enviamos JSON
                    body: JSON.stringify(datosTramite) // Transforma el objeto JavaScript a texto plano para el viaje
                });
                if (response.ok) {
                    document.getElementById('modalExito').style.display = 'flex'; // Muestra el mensaje de exito
                    formTramite.reset(); // Limpia el formulario
                } else alert("Hubo un error al guardar tu solicitud.");
            } catch (error) {
                console.error("🚨 Error de conexión:", error);
            }
        });
    }

    // VALIDACIÓN FORMULARIO COMPRAR
    const formComprar = document.getElementById('formComprar');
    if (formComprar) {
        // Lógica similar al trámite, pero para el formulario de compra
        const urlParams = new URLSearchParams(window.location.search);
        const idInmuebleSolicitado = urlParams.get('inmueble');

        // Si el usuario llega desde el catálogo para comprar una casa específica, adaptamos el formulario
        if (idInmuebleSolicitado) {
            const seccionPreferencias = document.getElementById('seccion_preferencias');
            if (seccionPreferencias) seccionPreferencias.style.display = 'none'; // Oculta preguntas irrelevantes
            const tituloFormulario = document.querySelector('.form-main-title');
            const subtituloFormulario = document.querySelector('.form-subtitle');
            if (tituloFormulario) tituloFormulario.innerText = 'Información de la Propiedad';
            if (subtituloFormulario) subtituloFormulario.innerText = 'Déjanos tus datos y nos contactaremos contigo a la brevedad.';
        }

        formComprar.addEventListener('submit', async (e) => {
            e.preventDefault();
            let formularioValido = true;
            let camposObligatorios = ['nombre', 'apellido', 'correo', 'telefono_principal'];
            
            // Si NO quiere una casa específica, el presupuesto y pago son obligatorios
            if (!idInmuebleSolicitado) camposObligatorios.push('presupuesto', 'forma_pago');

            // Bucle de validación de campos vacíos (mismo patrón que en trámites)
            camposObligatorios.forEach(id => {
                const input = document.getElementById(id);
                if (!input) return;
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

            const inputPresupuesto = document.getElementById('presupuesto');
            const inputFormaPago = document.getElementById('forma_pago');
            
            // Armado del Payload (paquete de datos)
            const datosCompra = {
                nombre: document.getElementById('nombre').value,
                apellido: document.getElementById('apellido').value,
                correo: document.getElementById('correo').value,
                telefonoPrincipal: document.getElementById('telefono_principal').value,
                telefonoSecundario: document.getElementById('telefono_secundario').value || null,
                presupuesto: inputPresupuesto ? (inputPresupuesto.value || null) : null,
                formaPago: inputFormaPago ? (inputFormaPago.value || null) : null,
                idInmuebleDeseado: idInmuebleSolicitado || null
            };

            try {
                const response = await fetch('https://backup-gossip-version.ngrok-free.dev/api/comprar', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(datosCompra)
                });
                if (response.ok) {
                    document.getElementById('modalExito').style.display = 'flex';
                    formComprar.reset();
                } else alert("Hubo un error al guardar tu solicitud.");
            } catch (error) {
                console.error("Error de conexión:", error);
            }
        });
    }

    // VALIDACIÓN FORMULARIO VENDER
    const formVender = document.getElementById('formVender');
    if (formVender) {
        formVender.addEventListener('submit', async (e) => {
            e.preventDefault();
            let formularioValido = true;
            
            // Todos estos campos son obligatorios para poder cotizar la venta de una casa
            const camposObligatorios = [
                'nombre', 'apellido', 'correo', 'telefono_principal',
                'ubicacion', 'codigo_postal', 'id_municipio', 'id_tipo', 'id_estado_in'
            ];

            camposObligatorios.forEach(id => {
                const input = document.getElementById(id);
                if(!input) return;
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
                vandalizada: document.getElementById('vandalizada').checked ? 1 : 0, // Convierte booleano a 1 o 0 para SQL
                invadida: document.getElementById('invadida').checked ? 1 : 0,
                creditoPendiente: document.getElementById('credito_pendiente').value || 0.00
            };

            try {
                const response = await fetch('https://backup-gossip-version.ngrok-free.dev/api/vender', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(datosVenta)
                });
                if (response.ok) {
                    document.getElementById('modalExito').style.display = 'flex';
                    formVender.reset();
                } else alert("Hubo un error al guardar tu solicitud.");
            } catch (error) {
                console.error("🚨 Error de conexión:", error);
            }
        });
    }
}

// Arrancar de manera segura
// Verifica si el navegador ya terminó de construir el HTML (el DOM) 
// Si no ha terminado, espera; si ya terminó, lanza la función principal
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initLuxHouseUI);
} else {
    initLuxHouseUI();
}