const mongoose = require("mongoose");

const carritoSchema = new mongoose.Schema({
  id_carrito: {
    type: String,
    required: true,
    unique: true,
  },
  productos: [
    {
      producto: {
        type: Object,
        required: true,
      },
      cantidadProducto: {
        type: Number,
        required: true,
      }
    },
  ],
  id_usuario: {
    type: String,
    required: true,
  },
  cantidad_productos: {
    type: Number,
    default: 0,
  },
  monto_total: {
    type: Number,
    default: 0,
  }
});

const Carrito = mongoose.model("Carrito", carritoSchema);

module.exports = Carrito;
