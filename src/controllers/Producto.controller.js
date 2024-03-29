const Producto = require('../models/Productos.models');

const obtenerProductos = async (req, res) => {
    try {
        const { nombre, categoria } = req.query;

        const condiciones = {};
        if (nombre) {
            condiciones.nombre = { $regex: new RegExp(nombre, 'i,I') };
        }
        if (categoria) {
            condiciones.categoria = categoria;
        }

        const productos = await Producto.find(condiciones);

        res.json({ productos });
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener los productos' });
    }
};

const crearProducto = async (req, res) => {
    try {
        if (!req.usuario.roles.includes('Administrador')) {
            return res.status(403).json({ error: 'No tienes permisos para crear productos' });
        }
        const nuevoProducto = await Producto.create(req.body);
        res.status(201).json({ message: 'Producto creado exitosamente', producto: nuevoProducto });
    } catch (error) {
        console.error('Error al crear el producto:', error);
        res.status(500).json({ error: 'Error al crear el producto', details: error.message });
    }
};


const actualizarProducto = async (req, res) => {
    try {
        if (!req.usuario.roles.includes('Administrador')) {
            return res.status(403).json({ error: 'No tienes permisos para actualizar productos' });
        }

        const productoActualizado = await Producto.findOneAndUpdate({ id_producto: req.params.id_producto }, req.body, { new: true });
        if (!productoActualizado) {
            return res.status(404).json({ mensaje: 'Producto no encontrado' });
        }

        
        
        res.json({ mensaje: 'Producto actualizado correctamente',producto: productoActualizado}); 
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar el producto', details: error.message });
    }
};


const eliminarProducto = async (req, res) => {
    try {
        if (!req.usuario.roles.includes('Administrador')) {
            return res.status(403).json({ error: 'No tienes permisos para eliminar productos' });
        }

        const productoEliminado = await Producto.findOneAndDelete({ id_producto: req.params.id_producto });
        if (!productoEliminado) {
            return res.status(404).json({ mensaje: 'Producto no encontrado' });
        }
        res.json({ mensaje: 'Producto eliminado correctamente', producto:productoEliminado });
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar el producto' });
    }
};
const obtenerProductoPorId = async (req, res) => {
    try {
        const producto = await Producto.findOne({ id_producto: req.params.id_producto });

        if (!producto) {
            return res.status(404).json({ mensaje: 'Producto no encontrado' });
        }

        res.json({ producto });
    } catch (error) {
        console.error('Error al obtener el producto por ID:', error);
        res.status(500).json({ error: 'Error al obtener el producto por ID', details: error.message });
    }
};

module.exports = {
    obtenerProductos,
    crearProducto,
    actualizarProducto,
    eliminarProducto,
    obtenerProductoPorId 
};
