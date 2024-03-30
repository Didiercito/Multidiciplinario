const Carrito = require("../models/Carritos.models");
const Producto = require("../models/Productos.models");
const Usuario = require('../models/Usuarios.models');

const agregarProductoAlCarrito = async (req, res) => {
  try {
    const { id_usuario, id_producto } = req.params;
    let { cantidadProducto } = req.body;

    if (!(cantidadProducto > 0)) {
      console.error("La cantidad del producto es inválida.");
      return res.status(400).json({ message: "La cantidad del producto es inválida." });
    }

    const usuarioExistente = await Usuario.findOne({ id_usuario });
    if (!usuarioExistente) {
      console.error("Usuario no encontrado.");
      return res.status(404).json({ message: "Usuario no encontrado." });
    }

    let carritoExistente = await Carrito.findOne({ id_usuario });

    const productoEncontrado = await Producto.findOne({ id_producto });
    if (!productoEncontrado) {
      console.error("Producto no encontrado.");
      return res.status(404).json({ message: "Producto no encontrado." });
    }

    if (cantidadProducto > productoEncontrado.cantidad) {
      console.error("Cantidad insuficiente del producto.");
      return res.status(400).json({ message: "Este producto ya no está disponible." });
    }

    if (!carritoExistente) {
      console.error("Carrito no encontrado para el usuario. Creando nuevo carrito...");
      carritoExistente = new Carrito({ id_usuario });
    }

    const productoExistenteIndex = carritoExistente.productos.findIndex(item => item.producto.toString() === id_producto);

    if (productoExistenteIndex !== -1) {
      carritoExistente.productos[productoExistenteIndex].cantidadProducto += cantidadProducto;
    } else {
      carritoExistente.productos.push({ producto: productoEncontrado._id, cantidadProducto });
    }

    carritoExistente.cantidad_productos += cantidadProducto;

    carritoExistente.monto_total += cantidadProducto * productoEncontrado.precio;

    const carritoActualizado = await carritoExistente.save();

    productoEncontrado.cantidad -= cantidadProducto;
    await productoEncontrado.save();

    res.status(200).json({ message: 'Producto agregado al carrito correctamente', carritoActualizado });
  } catch (error) {
    console.error(error.message);
    res.status(400).json({ message: error.message });
  }
};



const eliminarProductoDelCarrito = async (req, res) => {
  try {
    const id_usuario = req.params.id_usuario;
    const id_producto = req.params.id_producto;

    if (!id_producto) {
      return res.status(400).json({ message: "El ID del producto no está definido." });
    }

    const carrito = await Carrito.findOne({ id_usuario });

    if (!carrito) {
      return res.status(404).json({ message: "Carrito no encontrado para el usuario." });
    }

    const productoAEliminarIndex = carrito.productos.findIndex(item => item.producto.toString() === id_producto);

    if (productoAEliminarIndex === -1) {
      return res.status(404).json({ message: "Producto no encontrado en el carrito." });
    }

    const productoAEliminar = carrito.productos[productoAEliminarIndex];

    // Devuelve la cantidad del producto al inventario
    const productoEliminado = await Producto.findById(productoAEliminar.producto);
    if (!productoEliminado) {
      return res.status(404).json({ message: "Producto eliminado no encontrado en la base de datos." });
    }

    productoEliminado.cantidad += productoAEliminar.cantidadProducto;
    await productoEliminado.save();

    carrito.cantidad_productos -= productoAEliminar.cantidadProducto;

    carrito.monto_total -= productoEliminado.precio * productoAEliminar.cantidadProducto;

    carrito.monto_total = Math.max(0, carrito.monto_total);

    carrito.productos.splice(productoAEliminarIndex, 1);

    await carrito.save();

    res.status(200).json({ message: "Producto eliminado correctamente", carrito });
  } catch (error) {
    res.status(400).json({ message: "Error al eliminar el producto del carrito.", error: error.message });
  }
};





const obtenerCarritosConProductos = async (req, res) => {
  try {
    const carritos = await Carrito.find().populate('productos.producto');

    res.status(200).json({ carritos });
  } catch (error) {
    res.status(500).json({ message: "Error al obtener los carritos con productos.", error: error.message });
  }
};

const buscarCarritoPorIdUsuario = async (req, res) => {
  try {
    const id_usuario = req.params.id_usuario;

    const carrito = await Carrito.findOne({ id_usuario });

    if (!carrito) {
      return res.status(404).json({ message: "Carrito no encontrado para el usuario." });
    }

    res.status(200).json({ carrito });
  } catch (error) {
    res.status(500).json({ message: "Error al buscar el carrito por ID de usuario.", error: error.message });
  }
};


module.exports = {
  eliminarProductoDelCarrito,
  agregarProductoAlCarrito,
  obtenerCarritosConProductos,
  buscarCarritoPorIdUsuario,
};

