const express = require('express');
const router = express.Router();
const carritoController = require('../controllers/carrito.controller');


router.post('/:id_usuario/agregar/:id_producto', carritoController.agregarProductoAlCarrito);

router.delete('/:id_usuario/eliminar/:id_producto', carritoController.eliminarProductoDelCarrito);

router.get('/', carritoController.obtenerCarritosConProductos);

router.get('/buscar/:id_usuario', carritoController.buscarCarritoPorIdUsuario);


module.exports = router;
