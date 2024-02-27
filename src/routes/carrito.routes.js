    const express = require('express');
    const router = express.Router();
    const carritoController = require('../controllers/Carrito.controller');

    // Ruta para obtener todos los carritos
    router.get('/', carritoController.getCarritos);

    // Ruta para obtener un carrito por su ID
    router.get('/:id', carritoController.getCarritoById);

    // Ruta para crear un nuevo carrito
    router.post('/', carritoController.createCarrito);

    // Ruta para agregar un producto al carrito
    router.post('/:id_usuario/agregarProducto/:id_producto', carritoController.addProductoToCarrito);

    // Ruta para actualizar un carrito
    router.put('/:id', carritoController.updateCarrito);

    // Ruta para eliminar un producto del carrito
    router.delete('/:id', carritoController.eliminarProductoDelCarrito);

    module.exports = router;
