const mongoose = require('mongoose');

const carritoSchema = new mongoose.Schema({
  id_carrito: {
    type: String,
    required: true,
    unique: true
  },
  productos: [{
    id_producto: {
      type: String,
      required: true
    },
    cantidad: {
      type: Number,
      default: 1
    }
  }],
  id_usuario: {
    type: String,
    required: true
  }
});

const Carrito = mongoose.model('Carrito', carritoSchema);

module.exports = Carrito;
