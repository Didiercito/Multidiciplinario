const express = require('express');
const router = express.Router();
const chatController = require('../controllers/Chat.controller');

// Ruta para enviar un mensaje a un usuario específico
router.post('/:id_usuario/enviar-mensaje', chatController.enviarMensaje);

// Ruta para obtener todos los mensajes de un usuario específico
router.get('/:id_usuario/mensajes', chatController.obtenerMensajes);

module.exports = router;
