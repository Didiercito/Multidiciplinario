const express = require('express');
const app = express();
const usuarioRoutes = require('./src/routes/Usuario.routes');
const productoRoutes = require('./src/routes/Producto.routes');
const carritoRoutes = require('./src/routes/carrito.routes');
const authRoutes = require('./src/routes/auth.routes');

app.use(express.json());
app.use('/api/v1/usuarios', usuarioRoutes);
app.use('/api/v1/productos', productoRoutes);
app.use('/carrito',carritoRoutes);
app.use('/api/v1/auth', authRoutes);

module.exports = app;
