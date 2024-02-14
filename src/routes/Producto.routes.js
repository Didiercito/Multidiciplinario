const express = require('express');
const router = express.Router();
const productoController = require('../controllers/Producto.controller');

router.post('/', productoController.crearProducto);
router.get('/', productoController.obtenerProductos);
router.get('/:id_producto', productoController.obtenerProductoPorId);
router.put('/:id_producto', productoController.actualizarProducto);
router.delete('/:id_producto', productoController.eliminarProducto);

module.exports = router;
