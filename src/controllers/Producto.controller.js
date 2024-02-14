const Producto = require('../models/Productos.models');

// Crear un nuevo producto
const crearProducto = async (req, res) => {
  try {
    const nuevoProducto = await Producto.create(req.body);
    res.status(201).json({ producto: nuevoProducto });
  } catch (error) {
    res.status(500).json({ error: 'Error al crear el producto' });
  }
};

// Obtener todos los productos
const obtenerProductos = async (req, res) => {
  try {
    const productos = await Producto.find({}, '-_id id_producto nombre descripcion caracteristicas cantidad foto_producto precio categoria');
    res.json({ productos });
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los productos' });
  }
};

// Obtener un producto por su ID
const obtenerProductoPorId = async (req, res) => {
  try {
    const producto = await Producto.findOne({ id_producto: req.params.id_producto }, '-_id id_producto nombre descripcion caracteristicas cantidad foto_producto precio categoria');
    if (!producto) {
      return res.status(404).json({ mensaje: 'Producto no encontrado' });
    }
    res.json({ producto });
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener el producto' });
  }
};

// Actualizar un producto por su ID
const actualizarProducto = async (req, res) => {
  try {
    const productoActualizado = await Producto.findOneAndUpdate({ id_producto: req.params.id_producto }, req.body, { new: true });
    if (!productoActualizado) {
      return res.status(404).json({ mensaje: 'Producto no encontrado' });
    }
    res.json({ producto: productoActualizado });
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar el producto' });
  }
};

// Eliminar un producto por su ID
const eliminarProducto = async (req, res) => {
  try {
    const productoEliminado = await Producto.findOneAndDelete({ id_producto: req.params.id_producto });
    if (!productoEliminado) {
      return res.status(404).json({ mensaje: 'Producto no encontrado' });
    }
    res.json({ mensaje: 'Producto eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar el producto' });
  }
};

module.exports = {
  crearProducto,
  obtenerProductos,
  obtenerProductoPorId,
  actualizarProducto,
  eliminarProducto
};
