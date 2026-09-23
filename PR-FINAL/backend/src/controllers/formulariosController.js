import { getConnection } from '../config/sqlserver.js';
import sql from 'mssql';

export const registrarCompra = async (req, res) => {
    // Recibimos los datos exactos que manda tu archivo ui.js
    const { 
        nombre, apellido, correo, telefonoPrincipal, telefonoSecundario, 
        interesTipo, interesMunicipio, presupuesto, formaPago 
    } = req.body;

    try {
        const pool = await getConnection();
        
        // Bloque de SQL que maneja ambas tablas y la regla UNIQUE del correo
        const query = `
            DECLARE @id_cliente INT;

            -- 1. Buscamos si el cliente ya está registrado por su correo
            SELECT @id_cliente = id_cliente 
            FROM db_logica_negocio.dbo.Cliente 
            WHERE correo = @Correo;

            -- 2. Si no existe, lo insertamos y capturamos su nuevo ID
            IF @id_cliente IS NULL
            BEGIN
                INSERT INTO db_logica_negocio.dbo.Cliente (nombre, apellido, correo, telefono_principal, telefono_secundario)
                VALUES (@Nombre, @Apellido, @Correo, @TelefonoPrincipal, @TelefonoSecundario);
                
                SET @id_cliente = SCOPE_IDENTITY();
            END
            ELSE
            BEGIN
                -- Si ya existe, actualizamos sus teléfonos por si cambiaron
                UPDATE db_logica_negocio.dbo.Cliente
                SET telefono_principal = @TelefonoPrincipal, telefono_secundario = @TelefonoSecundario
                WHERE id_cliente = @id_cliente;
            END

            -- 3. Insertamos la solicitud de compra ligada a ese cliente
            INSERT INTO db_logica_negocio.dbo.Solicitudes_Compra 
            (id_cliente, id_tipo_interes, id_municipio_interes, presupuesto, forma_pago)
            VALUES 
            (@id_cliente, @TipoInteres, @MunicipioInteres, @Presupuesto, @FormaPago);
        `;

        await pool.request()
            .input('Nombre', sql.VarChar, nombre)
            .input('Apellido', sql.VarChar, apellido)
            .input('Correo', sql.VarChar, correo)
            .input('TelefonoPrincipal', sql.VarChar, telefonoPrincipal)
            .input('TelefonoSecundario', sql.VarChar, telefonoSecundario || null)
            .input('TipoInteres', sql.SmallInt, interesTipo)
            .input('MunicipioInteres', sql.SmallInt, interesMunicipio)
            .input('Presupuesto', sql.Decimal(12, 2), presupuesto)
            .input('FormaPago', sql.VarChar, formaPago)
            .query(query);

        res.status(200).json({ mensaje: "Solicitud registrada con éxito en ambas tablas" });
        
    } catch (error) {
        console.error('Error al guardar el formulario:', error);
        res.status(500).json({ error: "Ocurrió un error en el servidor" });
    }
};

export const registrarVenta = async (req, res) => {
    const { 
        nombre, apellido, correo, telefonoPrincipal, telefonoSecundario, 
        ubicacion, codigoPostal, idMunicipio, idTipo, idEstadoIn, 
        vandalizada, invadida, creditoPendiente
    } = req.body;

    try {
        const pool = await getConnection();
        
        const query = `
            DECLARE @id_cliente INT;
            DECLARE @id_inmueble INT;

            -- 1. Buscamos o creamos al cliente
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

            -- 2. Registramos el inmueble
            INSERT INTO db_logica_negocio.dbo.Inmueble 
            (ubicacion, codigo_postal, vandalizada, invadida, credito_pendiente, id_municipio, id_tipo, id_estado_in)
            VALUES 
            (@Ubicacion, @CodigoPostal, @Vandalizada, @Invadida, @CreditoPendiente, @IdMunicipio, @IdTipo, @IdEstadoIn);
            
            SET @id_inmueble = SCOPE_IDENTITY();

            -- 3. Ligamos al cliente con el inmueble en una Operación de Venta (id_servicio = 2)
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
        console.error('🚨 Error detallado de SQL Server:', error);
        res.status(500).json({ error: "Ocurrió un error en el servidor" });
    }
};

export const registrarTramite = async (req, res) => {
    const { 
        nombre, apellido, correo, telefonoPrincipal, telefonoSecundario, 
        idMunicipio, ubicacionTramite, servicios, tramites
    } = req.body;

    try {
        const pool = await getConnection();
        
        let idCliente;
        const resultCliente = await pool.request()
            .input('Correo', sql.VarChar, correo)
            .query(`SELECT id_cliente FROM db_logica_negocio.dbo.Cliente WHERE correo = @Correo`);

        if (resultCliente.recordset.length > 0) {
            idCliente = resultCliente.recordset[0].id_cliente;
            await pool.request()
                .input('IdCliente', sql.Int, idCliente)
                .input('TelefonoPrincipal', sql.VarChar, telefonoPrincipal)
                .input('TelefonoSecundario', sql.VarChar, telefonoSecundario || null)
                .query(`UPDATE db_logica_negocio.dbo.Cliente SET telefono_principal = @TelefonoPrincipal, telefono_secundario = @TelefonoSecundario WHERE id_cliente = @IdCliente`);
        } else {
            const insertCliente = await pool.request()
                .input('Nombre', sql.VarChar, nombre)
                .input('Apellido', sql.VarChar, apellido)
                .input('Correo', sql.VarChar, correo)
                .input('TelefonoPrincipal', sql.VarChar, telefonoPrincipal)
                .input('TelefonoSecundario', sql.VarChar, telefonoSecundario || null)
                .query(`INSERT INTO db_logica_negocio.dbo.Cliente (nombre, apellido, correo, telefono_principal, telefono_secundario) OUTPUT INSERTED.id_cliente VALUES (@Nombre, @Apellido, @Correo, @TelefonoPrincipal, @TelefonoSecundario)`);
            idCliente = insertCliente.recordset[0].id_cliente;
        }

        // 1. Variable para atrapar el ID de la operación
        let idOperacionPrincipal = null;

        // Registrar los Servicios
        for (const idServicio of servicios) {
            const resultOperacion = await pool.request()
                .input('IdCliente', sql.Int, idCliente)
                .input('IdServicio', sql.SmallInt, parseInt(idServicio))
                .query(`
                    INSERT INTO db_logica_negocio.dbo.Operaciones 
                    (id_cliente, id_servicio, fecha_inicio, estado_proceso, monto_operacion)
                    OUTPUT INSERTED.id_operacion -- <-- Atrapamos el ID generado
                    VALUES (@IdCliente, @IdServicio, GETDATE(), 'Iniciado', 0.00)
                `);
            
            // Guardamos el primer ID que se genere para ligarlo a los trámites
            if (!idOperacionPrincipal) {
                idOperacionPrincipal = resultOperacion.recordset[0].id_operacion;
            }
        }

        // Registrar los Trámites (Ahora sí incluyendo el id_operacion)
        for (const idTramite of tramites) {
            await pool.request()
                .input('IdCliente', sql.Int, idCliente)
                .input('IdTramite', sql.SmallInt, parseInt(idTramite))
                .input('IdOperacion', sql.Int, idOperacionPrincipal) // <-- Lo inyectamos aquí
                .input('Ubicacion', sql.VarChar, ubicacionTramite || null)
                .input('IdMunicipio', sql.SmallInt, parseInt(idMunicipio))
                .query(`
                    INSERT INTO db_logica_negocio.dbo.Operaciones_tramites 
                    (id_cliente, id_tramite, id_operacion, direccion_referencia, costo_tramite, fecha_inicio, estado_proceso, id_municipio)
                    VALUES (@IdCliente, @IdTramite, @IdOperacion, @Ubicacion, 0.00, GETDATE(), 'Iniciado', @IdMunicipio) 
                `); // <-- Y lo agregamos a la consulta de SQL
        }

        res.status(200).json({ mensaje: "Trámites registrados con éxito" });
        
    } catch (error) {
        console.error('🚨 Error detallado de SQL Server:', error);
        res.status(500).json({ error: "Ocurrió un error en el servidor al registrar el trámite" });
    }
};