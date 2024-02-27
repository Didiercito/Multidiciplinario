const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/Usuario.controller');
const VerificarJWT = require('../middleware/auth.middleware');

router.get('/usuarios', VerificarJWT, usuarioController.obtenerUsuarios);
router.get('/usuarios/:id_usuario', usuarioController.obtenerUsuarioPorId);
router.put('/usuarios/:id_usuario', usuarioController.actualizarUsuario);
router.delete('/usuarios/:id_usuario', usuarioController.eliminarUsuario);

module.exports = router;
