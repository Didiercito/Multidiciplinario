const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
    usuario: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Usuario', 
        required: true
    },
    mensajes: [{
        remitente: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Usuario'
        },
        contenido: String,
        fechaEnvio: {
            type: Date,
            default: Date.now
        }
    }]
});

const Chat = mongoose.model('Chat', chatSchema);

module.exports = Chat;
