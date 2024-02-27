const socketIO = require('socket.io');
const MensajeController = require('../controllers/Mensaje.controller');

module.exports = (server) => {
  const io = socketIO(server);

  io.on('connection', (socket) => {
    console.log('Nuevo cliente conectado');

    socket.on('enviarMensaje', async (data) => {
      try {
        const mensaje = await MensajeController.enviarMensaje(data.remitenteId, data.destinatarioId, data.contenido);
        io.emit('nuevoMensaje', mensaje);
      } catch (error) {
        console.error('Error al enviar el mensaje:', error.message);
      }
    });

    socket.on('disconnect', () => {
      console.log('Cliente desconectado');
    });
  });
};
