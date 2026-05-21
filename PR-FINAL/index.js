const express = require('express');
const path = require('path');
const app = express();
const port = 3000;

// Configurar la carpeta Public como estática
app.use(express.static(path.join(__dirname, 'Public')));

// Ruta principal que envía a tu inicio
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'Public', 'html', 'index.html'));
});

app.listen(port, () => {
    console.log(`Servidor de la inmobiliaria corriendo en http://localhost:${port}`);
});