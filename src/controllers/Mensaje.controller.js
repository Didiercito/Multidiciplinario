const fs = require('fs');
const Mensaje = require('../models/Mensaje.models');

const convertirImg = (rutaImagen) => {
  try {
    const imagenData = fs.readFileSync(rutaImagen);
    const base64String = Buffer.from(imagenData).toString('base64');
    return base64String;
  } catch (error) {
    console.error('Error al convertir la imagen a base64:', error);
    throw new Error('Error al convertir la imagen a base64');
  }
};

const enviarMensajeConImagen = async (remitenteId, destinatarioId, contenido, imagenRuta) => {
  try {
    const imagenData = convertirImg(imagenRuta);
    const mensaje = new Mensaje({
      remitente: remitenteId,
      destinatario: destinatarioId,
      contenido: contenido,
      imagen: {
        data: Buffer.from(imagenData, 'base64'),
        contentType: 'image/jpeg'
      }
    });
    await mensaje.save();
    return mensaje;
  } catch (error) {
    throw new Error('Error al enviar el mensaje con imagen');
  }
};

const obtenerMensajesDeUsuario = async (usuarioId) => {
  try {
    const mensajes = await Mensaje.find({ destinatario: usuarioId }).populate('remitente');
    return mensajes;
  } catch (error) {
    throw new Error('Error al obtener los mensajes del usuario');
  }
};

module.exports = {
  enviarMensajeConImagen,
  obtenerMensajesDeUsuario
};
