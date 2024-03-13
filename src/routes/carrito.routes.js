    const express = require('express');
    const router = express.Router();
    const carritoController = require('../controllers/carrito.controller');

    router.get('/', carritoController.obtenerCarritos);

    router.get('/:id', carritoController.obtenerCarritoPorId);

    router.post('/', carritoController.crearCarrito);

    router.post('/:id_usuario/agregarProducto/:id_producto', carritoController.agregarProductoAlCarrito);

    router.put('/:id', carritoController.actualizarCarrito);

    router.delete('/:id', carritoController.eliminarProductoDelCarrito);

    module.exports = router;
