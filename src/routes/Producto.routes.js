const express = require('express');
const router = express.Router();
const productoController = require('../controllers/Producto.controller');
const VerificarJWT = require('../middleware/auth.middleware');
const accountLimiter = require('../middleware/rateLimit.middleware');

router.get('/', accountLimiter,productoController.obtenerProductos);
router.post('/', VerificarJWT, productoController.crearProducto); 
router.put('/:id_producto', VerificarJWT, productoController.actualizarProducto);
router.delete('/:id_producto', VerificarJWT, productoController.eliminarProducto);

module.exports = router;
