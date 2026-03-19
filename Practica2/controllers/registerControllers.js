exports.registrarUsuario = (req, res) => {

    const { nombre, tel, correo } = req.body;

    // Validaciones básicas
    if (!nombre || !tel || !correo) {
        return res.status(400).json({
            mensaje: "Todos los campos son obligatorios"
        });
    }

    // Simulación de guardado
    const usuario = {
        nombre,
        tel,
        correo
    };

    console.log("Datos recibidos:", usuario);

    res.status(200).json({
        mensaje: "Usuario registrado correctamente",
        data: usuario
    });
};