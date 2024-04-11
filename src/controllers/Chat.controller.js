const Chat = require('../models/Chat.models');
const Usuario = require('../models/Usuarios.models')

const enviarMensaje = async (req, res) => {
    try {
        const { id_usuario } = req.params; 
        const { contenido } = req.body; 

        const remitente = await Usuario.findById(id_usuario);

        if (!remitente) {
            return res.status(404).json({ mensaje: 'Usuario no encontrado' });
        }

        let chat = await Chat.findOne({ usuario: id_usuario });

        if (!chat) {
            chat = await Chat.create({ usuario: id_usuario, mensajes: [] });
        }

        const nuevoMensaje = {
            remitente: remitente._id, 
            nombreRemitente: remitente.nombre, 
            contenido
        };

        chat.mensajes.push(nuevoMensaje);
        await chat.save();

        res.status(200).json({ mensaje: 'Mensaje enviado correctamente' });
    } catch (error) {
        console.error('Error al enviar el mensaje:', error);
        res.status(500).json({ mensaje: 'Hubo un error al enviar el mensaje' });
    }
};


const obtenerMensajes = async (req, res) => {
    try {
        const { id_usuario } = req.params;

        const chat = await Chat.findOne({ usuario: id_usuario });

        if (!chat) {
            return res.status(404).json({ mensaje: 'Chat no encontrado' });
        }

        const mensajes = chat.mensajes;

        res.status(200).json({ mensajes });
    } catch (error) {
        console.error('Error al obtener los mensajes:', error);
        res.status(500).json({ mensaje: 'Hubo un error al obtener los mensajes' });
    }
};

module.exports = {
    enviarMensaje,
    obtenerMensajes
};
