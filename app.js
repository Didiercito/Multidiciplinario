const express = require('express');
const app = express();
const usuarioRoutes = require('./src/routes/Usuario.routes');
const productoRoutes = require('./src/routes/Producto.routes');

app.use(express.json());
app.use('/usuarios', usuarioRoutes);
app.use('/productos', productoRoutes);

module.exports = app;
