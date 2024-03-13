const mongoose = require('mongoose');

const usuarioSchema = new mongoose.Schema({
  id_usuario: {
    type: String,
    required: true,
    unique: true
  },
  nombre: {
    type: String,
    required: true
  },
  apellido: {
    type: String,
    required: true
  },
  correo: {
    type: String,
    required: true,
    unique: true
  },
  contrasena: {
    type: String,
    required: true
  },
  telefono: {
    type: String,
    required: true,
    unique: true
  },
  usuario: {
    type: String,
    required: true,
    unique: true
  },
  foto_perfil: {
    type: String,
    required: true
  },
  carrito: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Carrito',
    }
  ],
  roles: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Rol',
    }
  ]
});

const Usuario = mongoose.model('Usuario', usuarioSchema);

module.exports = Usuario;
