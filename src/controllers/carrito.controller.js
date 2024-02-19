const Carrito = require("../models/Carritos.models");
const Producto = require('../models/Productos.models')
const { v4: uuidv4 } = require('uuid');

// Controlador para obtener todos los carritos
const getCarritos = async (req, res) => {
  try {
    const carritos = await Carrito.find();
    res.status(200).json(carritos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Controlador para obtener un carrito por su ID
const getCarritoById = async (req, res) => {
  try {
    const carrito = await Carrito.findById(req.params.id);
    if (carrito) {
      res.status(200).json(carrito);
    } else {
      res.status(404).json({ message: "Carrito no encontrado" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Controlador para crear un nuevo carrito
const createCarrito = async (req, res) => {
  try {
    const id_carrito = uuidv4();
    const producto = await Producto.findOne({ id_Producto: req.body.productos.producto });

    if (!producto) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }

    const nuevoCarrito = await Carrito.create({
      id_carrito: id_carrito,
      productos: [{
        producto: producto, // Aquí se asigna solo el _id del producto
        cantidad: req.body.productos.cantidad,
      }],
      id_usuario: req.body.id_usuario,
    });

    res.status(201).json(nuevoCarrito);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Controlador para actualizar un carrito
const updateCarrito = async (req, res) => {
  try {
    const idUsuario = req.params.id;
    const nuevoCarrito = req.body;

    const carritoActualizado = await Carrito.findOneAndUpdate(
      { id_usuario: idUsuario },
      nuevoCarrito,
      { new: true }
    );

    if (carritoActualizado) {
      res.status(200).json(carritoActualizado);
    } else {
      res.status(404).json({ message: "Carrito no encontrado" });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Controlador para eliminar un carrito
const eliminarProductoDelCarrito = async (req, res) => {
  try {
    const idUsuario = req.params.id;
    const id_producto = req.body.idProducto; // Suponiendo que se envía el ID del producto a eliminar en el cuerpo de la solicitud

    const carrito = await Carrito.findOne({ id_usuario: idUsuario });

    // Filtra el producto que deseas eliminar
    carrito.productos = carrito.productos.filter(producto => producto._id != id_producto);


    // Guarda los cambios en la base de datos
    await carrito.save();

    if (carrito) {
      res.status(200).json(carrito);
    } else {
      res.status(404).json({ message: "Carrito no encontrado" });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


module.exports= {
  getCarritos,
  getCarritoById,
  createCarrito,
  updateCarrito,
  eliminarProductoDelCarrito
}