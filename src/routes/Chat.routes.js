const express = require('express');
const router = express.Router();
const chatController = require ('../controllers/Chat.controller');

router.post('/iniciar-chat/:id_usuario',chatController.IniciarChat);
router.post('/enviar-mensaje', chatController.enviarMensaje);

module.exports = router;

