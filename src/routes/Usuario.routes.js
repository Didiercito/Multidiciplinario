const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/Usuario.controller');

router.post('/usuarios', usuarioController.crearUsuario);
router.get('/usuarios', usuarioController.obtenerUsuarios);
router.get('/usuarios/:id_usuario', usuarioController.obtenerUsuarioPorId);
router.put('/usuarios/:id_usuario', usuarioController.actualizarUsuario);
router.delete('/usuarios/:id_usuario', usuarioController.eliminarUsuario);
router.post('/usuarios/:id_usuario/carritos/:id_carrito/agregar-producto/:id_producto', usuarioController.agregarProductoAlCarrito);

module.exports = router;
    