const express = require('express');
const router = express.Router();
const carritoController = require('../controllers/Carritos.controller');
const accountLimiter = require('../middleware/rateLimit.middleware');

router.post('/:id_usuario/agregar/:id_producto', carritoController.agregarProductoAlCarrito);
router.delete('/:id_usuario/eliminar/:id_producto', carritoController.eliminarProductoDelCarrito);
router.delete('/:id_usuario/eliminar-todo', carritoController.eliminarTodosLosProductosDelCarrito);
router.put('/:id_usuario/actualizar/:id_producto/:cantidadProducto', carritoController.actualizarCarrito);
router.get('/', accountLimiter, carritoController.obtenerCarritosConProductos);
router.get('/buscar/:id_usuario', accountLimiter, carritoController.buscarCarritoPorIdUsuario);

module.exports = router;
