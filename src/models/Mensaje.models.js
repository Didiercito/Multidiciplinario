const mongoose = require('mongoose');

const mensajeSchema = new mongoose.Schema({
    remitente: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    },
    destinatario: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    },
    contenido: {
        type: String,
        required: true
        },
    imagen: {   
        data: Buffer,
        contentType: String
    },
    fechaEnvio: {
        type: Date,
        default: Date.now
    }
});

const Mensaje = mongoose.model('Mensaje', mensajeSchema);

module.exports = Mensaje;
