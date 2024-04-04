const Chat = require('../models/Chat.models');
const Usuario = require('../models/Usuarios.models'); // Suponiendo que tengas un modelo de Usuario


const IniciarChat = async (req, res) => {
    try {
        const { id_usuario } = req.params; 

        const usuario = await Usuario.findOne({ id_usuario });

        if (!usuario) {
            return res.status(404).json({ mensaje: 'Usuario no encontrado' });
        }

        // Verifica si req.usuario está definido antes de acceder a su propiedad _id
        if (!req.usuario || !req.usuario._id) {
            return res.status(401).json({ mensaje: 'Usuario no autenticado' });
        }

        const chatExistente = await Chat.findOne({ usuario: id_usuario, administrador: req.usuario._id });
        if (chatExistente) {
            return res.status(400).json({ mensaje: 'Ya existe un chat entre el usuario y el administrador' });
        }

        const nuevoChat = new Chat({
            usuario: id_usuario,
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

        // Buscar el chat en la base de datos
        const chat = await Chat.findById(chatId);

        // Verificar si el chat existe
        if (!chat) {
            return res.status(404).json({ mensaje: 'Chat no encontrado' });
        }

        // Verificar si el remitente es parte del chat
        if (chat.usuario.toString() !== remitente && chat.administrador.toString() !== remitente) {
            return res.status(403).json({ mensaje: 'No tienes permiso para enviar mensajes en este chat' });
        }

        // Agregar el mensaje al chat
        chat.mensajes.push({ remitente, contenido });
        await chat.save();

        // Emitir un evento de nuevo mensaje (si estás usando WebSockets)
        req.app.get('io').to(chatId).emit('nuevoMensaje', { remitente, contenido });

        // Responder con un mensaje de éxito
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
