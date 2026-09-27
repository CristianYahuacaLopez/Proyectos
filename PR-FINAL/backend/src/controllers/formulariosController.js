import { getConnection } from '../config/sqlserver.js';
import sql from 'mssql';

export const registrarCompra = async (req, res) => {
    try {
        const { 
            nombre, apellido, correo, telefonoPrincipal, telefonoSecundario, 
            interesTipo, interesMunicipio, presupuesto, formaPago, idInmuebleDeseado 
        } = req.body || {};

        const presupuestoLimpio = presupuesto ? parseFloat(presupuesto) : null;
        const pool = await getConnection();
        
        const query = `
            SET NOCOUNT ON;
            DECLARE @id_cliente INT;

            SELECT @id_cliente = id_cliente 
            FROM db_logica_negocio.dbo.Cliente 
            WHERE correo = @Correo;

            IF @id_cliente IS NULL
            BEGIN
                INSERT INTO db_logica_negocio.dbo.Cliente (nombre, apellido, correo, telefono_principal, telefono_secundario)
                VALUES (@Nombre, @Apellido, @Correo, @TelefonoPrincipal, @TelefonoSecundario);
                SET @id_cliente = SCOPE_IDENTITY();
            END
            ELSE
            BEGIN
                UPDATE db_logica_negocio.dbo.Cliente
                SET telefono_principal = @TelefonoPrincipal, telefono_secundario = @TelefonoSecundario
                WHERE id_cliente = @id_cliente;
            END

            INSERT INTO db_logica_negocio.dbo.Solicitudes_Compra 
            (id_cliente, id_tipo_interes, id_municipio_interes, presupuesto, forma_pago, id_inmueble_deseado)
            VALUES 
            (@id_cliente, @TipoInteres, @MunicipioInteres, @Presupuesto, @FormaPago, @IdInmuebleDeseado);
        `;

        await pool.request()
            .input('Nombre', sql.VarChar, nombre)
            .input('Apellido', sql.VarChar, apellido)
            .input('Correo', sql.VarChar, correo)
            .input('TelefonoPrincipal', sql.VarChar, telefonoPrincipal)
            .input('TelefonoSecundario', sql.VarChar, telefonoSecundario || null)
            .input('TipoInteres', sql.SmallInt, interesTipo || null)
            .input('MunicipioInteres', sql.SmallInt, interesMunicipio || null)
            .input('Presupuesto', sql.Decimal(12, 2), presupuestoLimpio) 
            .input('FormaPago', sql.VarChar, formaPago || null)
            .input('IdInmuebleDeseado', sql.Int, idInmuebleDeseado || null)
            .query(query);

        res.status(200).json({ mensaje: "Solicitud registrada con éxito" });
        
    } catch (error) {
        console.error('Error al guardar el formulario de compra:', error);
        res.status(500).json({ error: "Ocurrió un error en el servidor" });
    }
};

export const registrarVenta = async (req, res) => {
    try {
        const { 
            nombre, apellido, correo, telefonoPrincipal, telefonoSecundario, 
            ubicacion, codigoPostal, idMunicipio, idTipo, idEstadoIn, 
            vandalizada, invadida, creditoPendiente
        } = req.body || {};

        const pool = await getConnection();
        
        const query = `
            SET NOCOUNT ON;
            DECLARE @id_cliente INT;
            DECLARE @id_inmueble INT;

            SELECT @id_cliente = id_cliente 
            FROM db_logica_negocio.dbo.Cliente 
            WHERE correo = @Correo;

            IF @id_cliente IS NULL
            BEGIN
                INSERT INTO db_logica_negocio.dbo.Cliente (nombre, apellido, correo, telefono_principal, telefono_secundario)
                VALUES (@Nombre, @Apellido, @Correo, @TelefonoPrincipal, @TelefonoSecundario);
                SET @id_cliente = SCOPE_IDENTITY();
            END
            ELSE
            BEGIN
                UPDATE db_logica_negocio.dbo.Cliente
                SET telefono_principal = @TelefonoPrincipal, telefono_secundario = @TelefonoSecundario
                WHERE id_cliente = @id_cliente;
            END

            INSERT INTO db_logica_negocio.dbo.Inmueble 
            (ubicacion, codigo_postal, vandalizada, invadida, credito_pendiente, id_municipio, id_tipo, id_estado_in)
            VALUES 
            (@Ubicacion, @CodigoPostal, @Vandalizada, @Invadida, @CreditoPendiente, @IdMunicipio, @IdTipo, @IdEstadoIn);
            
            SET @id_inmueble = SCOPE_IDENTITY();

            INSERT INTO db_logica_negocio.dbo.Operaciones 
            (id_cliente, id_inmueble, id_servicio, fecha_inicio, estado_proceso, monto_operacion)
            VALUES 
            (@id_cliente, @id_inmueble, 2, GETDATE(), 'Iniciado', 0.00);
        `;

        await pool.request()
            .input('Nombre', sql.VarChar, nombre)
            .input('Apellido', sql.VarChar, apellido)
            .input('Correo', sql.VarChar, correo)
            .input('TelefonoPrincipal', sql.VarChar, telefonoPrincipal)
            .input('TelefonoSecundario', sql.VarChar, telefonoSecundario || null)
            .input('Ubicacion', sql.VarChar, ubicacion)
            .input('CodigoPostal', sql.VarChar, codigoPostal)
            .input('IdMunicipio', sql.SmallInt, idMunicipio)
            .input('IdTipo', sql.SmallInt, idTipo)
            .input('IdEstadoIn', sql.SmallInt, idEstadoIn)
            .input('Vandalizada', sql.Bit, vandalizada)
            .input('Invadida', sql.Bit, invadida)
            .input('CreditoPendiente', sql.Decimal(12, 2), creditoPendiente)
            .query(query);

        res.status(200).json({ mensaje: "Venta registrada con éxito" });
        
    } catch (error) {
        console.error('🚨 Error detallado de SQL Server en Venta:', error);
        res.status(500).json({ error: "Ocurrió un error en el servidor" });
    }
};

export const registrarTramite = async (req, res) => {
    try {
        const { 
            nombre, apellido, correo, telefonoPrincipal, telefonoSecundario, 
            idMunicipio, id_municipio, ubicacionTramite, servicios, tramites
        } = req.body || {};

        const listaServicios = Array.isArray(servicios) ? servicios : (servicios ? [servicios] : []);
        const listaTramites = Array.isArray(tramites) ? tramites : (tramites ? [tramites] : []);
        const municipioFinal = idMunicipio || id_municipio; 

        const pool = await getConnection();
        
        const queryCliente = `
            SET NOCOUNT ON;
            DECLARE @id_cliente INT;

            SELECT @id_cliente = id_cliente 
            FROM db_logica_negocio.dbo.Cliente 
            WHERE correo = @Correo;

            IF @id_cliente IS NULL
            BEGIN
                INSERT INTO db_logica_negocio.dbo.Cliente (nombre, apellido, correo, telefono_principal, telefono_secundario)
                VALUES (@Nombre, @Apellido, @Correo, @TelefonoPrincipal, @TelefonoSecundario);
                
                SET @id_cliente = SCOPE_IDENTITY();
            END
            ELSE
            BEGIN
                UPDATE db_logica_negocio.dbo.Cliente
                SET telefono_principal = @TelefonoPrincipal, telefono_secundario = @TelefonoSecundario
                WHERE id_cliente = @id_cliente;
            END

            SELECT @id_cliente AS idClienteFinal;
        `;

        const resultCliente = await pool.request()
            .input('Nombre', sql.VarChar, nombre)
            .input('Apellido', sql.VarChar, apellido)
            .input('Correo', sql.VarChar, correo)
            .input('TelefonoPrincipal', sql.VarChar, telefonoPrincipal)
            .input('TelefonoSecundario', sql.VarChar, telefonoSecundario || null)
            .query(queryCliente);

        // Lectura segura utilizando encadenamiento opcional para evitar fallos si el registro viene vacío
        const idCliente = resultCliente.recordset?.[0]?.idClienteFinal;

        if (!idCliente) {
            throw new Error("Fallo al obtener el ID del cliente modificado en la base de datos.");
        }
        
        let idOperacionPrincipal = null;

        if (listaServicios.length > 0) {
            for (const idServicio of listaServicios) {
                const resultOperacion = await pool.request()
                    .input('IdCliente', sql.Int, idCliente)
                    .input('IdServicio', sql.SmallInt, parseInt(idServicio))
                    .query(`
                        SET NOCOUNT ON;
                        INSERT INTO db_logica_negocio.dbo.Operaciones 
                        (id_cliente, id_servicio, fecha_inicio, estado_proceso, monto_operacion)
                        OUTPUT INSERTED.id_operacion
                        VALUES (@IdCliente, @IdServicio, GETDATE(), 'Iniciado', 0.00)
                    `);
                
                if (!idOperacionPrincipal && resultOperacion.recordset?.length > 0) {
                    idOperacionPrincipal = resultOperacion.recordset[0].id_operacion;
                }
            }
        }

        if (listaTramites.length > 0) {
            for (const idTramite of listaTramites) {
                await pool.request()
                    .input('IdCliente', sql.Int, idCliente)
                    .input('IdTramite', sql.SmallInt, parseInt(idTramite))
                    .input('IdOperacion', sql.Int, idOperacionPrincipal) 
                    .input('Ubicacion', sql.VarChar, ubicacionTramite || null)
                    .input('IdMunicipio', sql.SmallInt, parseInt(municipioFinal))
                    .query(`
                        SET NOCOUNT ON;
                        INSERT INTO db_logica_negocio.dbo.Operaciones_tramites 
                        (id_cliente, id_tramite, id_operacion, direccion_referencia, costo_tramite, fecha_inicio, estado_proceso, id_municipio)
                        VALUES (@IdCliente, @IdTramite, @IdOperacion, @Ubicacion, 0.00, GETDATE(), 'Iniciado', @IdMunicipio) 
                    `); 
            }
        }

        res.status(200).json({ mensaje: "Petición registrada con éxito" });
        
    } catch (error) {
        console.error('🚨 Error detallado de SQL Server:', error);
        res.status(500).json({ error: "Ocurrió un error en el servidor" });
    }
};