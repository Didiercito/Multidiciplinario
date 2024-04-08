const Chat = require('../models/Chat.models');
const Usuario = require('../models/Usuarios.models');


//El unico error que hay es con este controlador, no se puede iniciar el chat con un usuario en especifico 

const IniciarChat = async (req, res) => {
    try {
        const { id_usuario } = req.params;

        if (!req.usuario.roles.includes('Administrador')) {
            return res.status(403).json({ mensaje: 'No tienes permisos para iniciar un chat' });
        }

        const usuario = await Usuario.findOne({ id_usuario });

        if (!usuario) {
            return res.status(404).json({ mensaje: 'Usuario no encontrado' });
        }

        const chatExistente = await Chat.findOne({ usuario: usuario._id, administrador: req.usuario._id });
        if (chatExistente) {
            return res.status(400).json({ mensaje: 'Ya existe un chat entre el usuario y el administrador' });
        }

        const nuevoChat = new Chat({
            usuario: usuario._id,
            administrador: req.usuario._id
        });
        await nuevoChat.save();

        req.app.get('io').emit('joinChat', nuevoChat._id);

        res.status(201).json({ mensaje: 'Chat iniciado correctamente' });
    } catch (error) {
        console.error('Error al iniciar el chat:', error);
        res.status(500).json({ mensaje: 'Hubo un error al iniciar el chat' });
    }
};

const enviarMensaje = async (req, res) => {
    try {
        const { chatId, remitente, contenido } = req.body;

        const chat = await Chat.findById(chatId);

        if (!chat) {
            return res.status(404).json({ mensaje: 'Chat no encontrado' });
        }

        if (chat.usuario.toString() !== remitente && chat.administrador.toString() !== remitente) {
            return res.status(403).json({ mensaje: 'No tienes permiso para enviar mensajes en este chat' });
        }

        chat.mensajes.push({ remitente, contenido });
        await chat.save();

        req.app.get('io').to(chatId).emit('nuevoMensaje', { remitente, contenido });

        res.status(200).json({ mensaje: 'Mensaje enviado correctamente' });
    } catch (error) {
        console.error('Error al enviar el mensaje:', error);
        res.status(500).json({ mensaje: 'Hubo un error al enviar el mensaje' });
    }
};

module.exports = {
    IniciarChat,
    enviarMensaje
};
