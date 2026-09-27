// ==========================================
// ui.js - LÓGICA COMPLETA Y BLINDADA
// ==========================================

// Funciones globales para que los botones de HTML las encuentren siempre
window.abrirModalOpciones = function() {
    const modal = document.getElementById('modalOpciones');
    if(modal) modal.style.display = 'flex';
};

window.cerrarModalOpciones = function() {
    const modal = document.getElementById('modalOpciones');
    if(modal) modal.style.display = 'none';
};

// Todo el cerebro de la aplicación encapsulado para evitar errores
function initLuxHouseUI() {
    
    // 1. LÓGICA DEL TEMA
    const btnTema = document.getElementById('btn-tema');
    const body = document.body;
    if (localStorage.getItem('lux_theme') === 'claro') {
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

    // 2. MODO INTELIGENTE PARA tramite.html
    const formTramite = document.getElementById('formTramite');
    if (formTramite) {
        
        // El As bajo la manga: Leemos la memoria interna en vez de la URL vacía
        const urlParams = new URLSearchParams(window.location.search);
        const servicioSolicitado = urlParams.get('servicio') || localStorage.getItem('lxh_servicio');
        const tramiteSolicitado = urlParams.get('tramite') || localStorage.getItem('lxh_tramite');

        // Limpiamos la memoria para futuras visitas libres
        localStorage.removeItem('lxh_servicio');
        localStorage.removeItem('lxh_tramite');

        const toggleExtras = document.getElementById('toggle_extras');
        const seccionSecundaria = document.getElementById('seccion_secundaria');
        const contenedorUbicacion = document.getElementById('contenedor_ubicacion');
        
        const checkboxesServicios = document.querySelectorAll('.chk-servicio');
        const checkboxesTramites = document.querySelectorAll('.chk-tramite');

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

        let modoActual = 'servicios';

        const relaciones = {
            'srv_compra_part': ['trm_general', 'trm_notarial'],
            'srv_venta_part': ['trm_general', 'trm_hipoteca'],
            'srv_infonavit': ['trm_general', 'trm_notarial', 'trm_poderes'],
            'srv_contado': ['trm_notarial']
        };

        const mapaTramites = { '1': 'trm_general', '2': 'trm_hipoteca', '3': 'trm_poderes', '4': 'trm_notarial' };

        const evaluarMostrarUbicacion = () => {
            let necesitaDireccion = false;
            checkboxesTramites.forEach(chk => {
                if (chk.checked && (chk.id === 'trm_hipoteca' || chk.id === 'trm_notarial')) {
                    necesitaDireccion = true;
                }
            });
            if(contenedorUbicacion) contenedorUbicacion.style.display = necesitaDireccion ? 'block' : 'none';
        };

        const recalcularTramitesRecomendados = () => {
            if (modoActual === 'servicios') {
                const algunServicioMarcado = Array.from(checkboxesServicios).some(chk => chk.checked);
                if (algunServicioMarcado) {
                    checkboxesTramites.forEach(trm => trm.checked = false);
                    checkboxesServicios.forEach(chk => {
                        if (chk.checked && relaciones[chk.id]) {
                            relaciones[chk.id].forEach(idTramite => {
                                const trmCheckbox = document.getElementById(idTramite);
                                if (trmCheckbox) trmCheckbox.checked = true;
                            });
                        }
                    });
                }
            }
            evaluarMostrarUbicacion();
        };

        if(toggleExtras) {
            toggleExtras.addEventListener('change', function() {
                seccionSecundaria.style.display = this.checked ? 'block' : 'none';
                if (this.checked && modoActual === 'servicios') recalcularTramitesRecomendados();
            });
        }

        checkboxesServicios.forEach(chk => chk.addEventListener('change', recalcularTramitesRecomendados));
        checkboxesTramites.forEach(chk => chk.addEventListener('change', evaluarMostrarUbicacion));

        // Magia: Prioridad Trámites
        if (tramiteSolicitado && !servicioSolicitado) {
            modoActual = 'tramites';
            tituloFormulario.innerText = 'Gestoría y Trámites';
            subtituloFormulario.innerText = 'Selecciona los trámites legales que requieres. Nosotros prepararemos tu expediente.';
            tituloPrimario.innerText = 'Trámites Principales';
            descPrimaria.innerText = 'Selecciona los trámites que requieres iniciar:';
            labelToggle.innerText = '¿Deseas asociar este trámite a un servicio inmobiliario?';
            descSecundaria.innerText = 'Opcional: Selecciona el servicio inmobiliario relacionado a tu trámite:';

            contenedorPrimario.appendChild(bloqueTramites);
            contenedorSecundario.appendChild(bloqueServicios);

            const idRealTramite = mapaTramites[tramiteSolicitado] || tramiteSolicitado;
            const chkObj = document.getElementById(idRealTramite);
            if (chkObj) {
                chkObj.checked = true;
                // Ya no forzamos toggleExtras ni seccionSecundaria a abrirse
                chkObj.dispatchEvent(new Event('change'));
            }
        } 
        // Magia: Prioridad Servicios
        else if (servicioSolicitado) {
            const chkObj = document.getElementById(servicioSolicitado);
            if (chkObj) {
                chkObj.checked = true;
                // Ya no forzamos toggleExtras ni seccionSecundaria a abrirse
                chkObj.dispatchEvent(new Event('change'));
            }
        }

        // Validación al Enviar Trámite
        formTramite.addEventListener('submit', async (e) => {
            e.preventDefault();
            let formularioValido = true;
            const camposObligatorios = ['nombre', 'apellido', 'correo', 'telefono_principal', 'id_municipio'];

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

            let serviciosSeleccionados = Array.from(document.querySelectorAll('.chk-servicio:checked')).map(cb => cb.value);
            let tramitesSeleccionados = Array.from(document.querySelectorAll('.chk-tramite:checked')).map(cb => cb.value);

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
                } else alert("Hubo un error al guardar tu solicitud.");
            } catch (error) {
                console.error("🚨 Error de conexión:", error);
            }
        });
    }

    // 3. VALIDACIÓN FORMULARIO COMPRAR
    const formComprar = document.getElementById('formComprar');
    if (formComprar) {
        const urlParams = new URLSearchParams(window.location.search);
        const idInmuebleSolicitado = urlParams.get('inmueble');

        if (idInmuebleSolicitado) {
            const seccionPreferencias = document.getElementById('seccion_preferencias');
            if (seccionPreferencias) seccionPreferencias.style.display = 'none';
            const tituloFormulario = document.querySelector('.form-main-title');
            const subtituloFormulario = document.querySelector('.form-subtitle');
            if (tituloFormulario) tituloFormulario.innerText = 'Información de la Propiedad';
            if (subtituloFormulario) subtituloFormulario.innerText = 'Déjanos tus datos y nos contactaremos contigo a la brevedad.';
        }

        formComprar.addEventListener('submit', async (e) => {
            e.preventDefault();
            let formularioValido = true;
            let camposObligatorios = ['nombre', 'apellido', 'correo', 'telefono_principal'];
            if (!idInmuebleSolicitado) camposObligatorios.push('presupuesto', 'forma_pago');

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
                const response = await fetch('http://localhost:5000/api/comprar', {
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

    // 4. VALIDACIÓN FORMULARIO VENDER
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
                } else alert("Hubo un error al guardar tu solicitud.");
            } catch (error) {
                console.error("🚨 Error de conexión:", error);
            }
        });
    }
}

// Arrancar de manera segura
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initLuxHouseUI);
} else {
    initLuxHouseUI();
}