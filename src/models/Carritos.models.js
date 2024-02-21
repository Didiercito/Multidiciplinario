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
        required: true
      }
    },
  ],
  id_usuario: {
    type: String,
    required: true,
  },
  //cntidad de productos, monto
});

const Carrito = mongoose.model("Carrito", carritoSchema);

module.exports = Carrito;
