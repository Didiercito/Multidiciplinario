const socketIo = require('socket.io');

function configureSocket(server) {
    const io = socketIo(server);

    io.on('connection', (socket) => {
        console.log('Nuevo cliente conectado');

        socket.on('joinChat', (chatId) => {
            socket.join(chatId);
            console.log(`Usuario ingresó al chat ${chatId}`);
        });

        socket.on('disconnect', () => {
            console.log('Cliente desconectado');
        });
    });

    return io;
}

module.exports = configureSocket;
