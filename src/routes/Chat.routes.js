const express = require('express');
const router = express.Router();
const chatController = require ('../controllers/Chat.controller');
const VerificarJWT = require('../middleware/auth.middleware');


router.post('/iniciar-chat/:id_usuario',VerificarJWT,chatController.IniciarChat);
router.post('/enviar-mensaje', chatController.enviarMensaje);

module.exports = router;

