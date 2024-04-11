const express = require('express');
const router = express.Router();
const chatController = require('../controllers/Chat.controller');

router.post('/:id_usuario/enviar-mensaje', chatController.enviarMensaje);

router.get('/:id_usuario/mensajes', chatController.obtenerMensajes);

module.exports = router;
