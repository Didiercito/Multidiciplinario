const mongoose = require('mongoose');

const productoSchema = new mongoose.Schema({
  id_producto: {
    type: String,
    required: true,
    unique: true
  },
  nombre: {
    type: String,
    required: true
  },
  descripcion: {
    type: String,
    required: true
  },
  caracteristicas: {
    type: String,
    require: true
  },
  cantidad: {
    type: Number,
    required: true
  },
  foto_producto: {
    type: String,
    require: true
  },
  precio: {
    type: Number,
    required: true
  },
  categoria: {
    type: String,
    required: true
  }
});

const Producto = mongoose.model('Producto', productoSchema);

module.exports = Producto;
