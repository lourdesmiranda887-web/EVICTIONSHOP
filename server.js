const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.use(express.static('public'));

// Función para generar código único
function generarCodigo() {
    return 'REF-' + Math.random().toString(36).substr(2, 9).toUpperCase();
}

// Ruta para procesar la confirmación
app.post('/confirmar-pago', (req, res) => {
    const { usuario, producto, monto } = req.body;
    const nuevoCodigo = generarCodigo();

    const registro = {
        fecha: new Date().toLocaleString(),
        codigo_verificacion: nuevoCodigo,
        discord_user: usuario,
        producto: producto,
        monto: monto,
        estatus: "PENDIENTE_DE_CAPTURA"
    };

    // Guardar en base de datos local (JSON)
    const archivo = 'ventas.json';
    let datos = [];

    if (fs.existsSync(archivo)) {
        datos = JSON.parse(fs.readFileSync(archivo));
    }

    datos.push(registro);
    fs.writeFileSync(archivo, JSON.stringify(datos, null, 2));

    res.json({ success: true, codigo: nuevoCodigo });
});

app.listen(PORT, () => {
    console.log(`✅ Servidor activo en: http://localhost:${PORT}`);
});