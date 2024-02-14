const mongoose = require('mongoose');

const carritoSchema = new mongoose.Schema({
  id_carrito: {
    type: String,
    required: true,
    unique: true
  },
  productos: [{
    producto: {
      type: {},
      required: true
    },
    cantidad: {
      type: Number,
    }
  }],
  id_usuario: {
    type: String,
    required: true
  }
});

const Carrito = mongoose.model('Carrito', carritoSchema);

module.exports = Carrito;
