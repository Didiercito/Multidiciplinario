const Producto = require('../models/Productos.models');
const Carrito = require('../models/Carritos.models');

const obtenerProductos = async (req, res) => {
    try {
        const { nombre, categoria } = req.query;

        const condiciones = {};
        if (nombre) {
            condiciones.nombre = { $regex: new RegExp(nombre, 'i') };
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

        const { cantidad, precio } = req.body;
        if (cantidad <= 0 || precio < 0) {
            return res.status(400).json({ error: 'La cantidad o el precio no son válidos' });
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

        const { cantidad, precio } = req.body;
        if (cantidad !== undefined && cantidad < 0 || precio !== undefined && precio < 0) {
            return res.status(400).json({ error: 'La cantidad o el precio no son válidos' });
        }

        const productoActualizado = await Producto.findOneAndUpdate({ id_producto: req.params.id_producto }, req.body, { new: true });
        if (!productoActualizado) {
            return res.status(404).json({ mensaje: 'Producto no encontrado' });
        }

        res.json({ mensaje: 'Producto actualizado correctamente', producto: productoActualizado });
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
        res.json({ mensaje: 'Producto eliminado correctamente', producto: productoEliminado });
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

const productosRecientes = async (req, res) => {
    try {
        const productosRecientes = await Producto.find().sort({ fecha_creacion: -1 }).limit(5);

        if (productosRecientes.length === 0) {
            return res.status(404).json({ mensaje: 'No se encontraron productos recientes' });
        }

        res.json({ productos: productosRecientes });
    } catch (error) {
        console.error('Error al obtener los productos recientes:', error);
        res.status(500).json({ error: 'Error al obtener los productos recientes', details: error.message });
    }
};


const obtenerProductosMasAgregados = async (req, res) => {
    try {
        const carritos = await Carrito.aggregate([
            { $unwind: "$productos" },
            { $group: { _id: "$productos.producto", totalCantidad: { $sum: "$productos.cantidadProducto" } } },
            { $lookup: { from: "productos", localField: "_id", foreignField: "_id", as: "producto" } },
            { $unwind: "$producto" },
            { $project: { 
                _id: "$producto.id_producto",
                nombre: "$producto.nombre",
                descripcion: "$producto.descripcion",
                caracteristicas: "$producto.caracteristicas",
                cantidad: "$producto.cantidad",
                foto_producto: "$producto.foto_producto",
                precio: "$producto.precio",
                categoria: "$producto.categoria",
                fecha_creacion: "$producto.fecha_creacion",
                cantidadProducto: "$totalCantidad"
            } },
            { $sort: { cantidadProducto: -1 } },
            { $limit: 5 }
        ]);

        if (carritos.length === 0) {
            return res.status(404).json({ mensaje: 'No se encontraron productos más agregados' });
        }

        res.status(200).json({ productos: carritos });
    } catch (error) {
        console.error('Error al obtener los productos más agregados:', error);
        res.status(500).json({ error: 'Error al obtener los productos más agregados', details: error.message });
    }
};

const obtenerProductosPorCategoria = async (req, res) => {
    try {
        const { categoria } = req.params;

        if (!categoria) {
            return res.status(400).json({ error: 'Debe proporcionar una categoría' });
        }

        const productos = await Producto.find({ categoria });

        if (productos.length === 0) {
            return res.status(404).json({ mensaje: 'No se encontraron productos para la categoría especificada' });
        }

        res.json({ productos });
    } catch (error) {
        console.error('Error al obtener productos por categoría:', error);
        res.status(500).json({ error: 'Error al obtener productos por categoría', details: error.message });
    }
};

module.exports = {
    obtenerProductos,
    crearProducto,
    actualizarProducto,
    eliminarProducto,
    obtenerProductoPorId,
    productosRecientes,
    obtenerProductosMasAgregados,
    obtenerProductosPorCategoria
};
