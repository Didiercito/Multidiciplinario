const Producto = require('../models/Productos.models');
const Carrito = require('../models/Carritos.models');

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

        if (req.body.cantidad <= 0) {
            return res.status(400).json({ error: 'La cantidad no es valida' });
        }

        if (req.body.precio < 0) {
            return res.status(400).json({ error: 'El precio no es valido' })
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

        if (req.body.cantidad < 0) {
            return res.status(400).json({ error: 'La cantidad no es valida' });
        }

        if (req.body.precio < 0) {
            return res.status(400).json({ error: 'El precio no es valido' })
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
        const carritos = await Carrito.find().populate('productos.producto');

        const productosAgregados = {};

        // Recorrer los carritos y contar la cantidad de veces que aparece cada producto
        carritos.forEach(carrito => {
            carrito.productos.forEach(item => {
                const idProducto = item.producto.id_producto;

                if (productosAgregados[idProducto]) {
                    productosAgregados[idProducto].cantidad += item.cantidadProducto;
                } else {
                    productosAgregados[idProducto] = {
                        id_producto: idProducto,
                        nombre: item.producto.nombre,
                        descripcion: item.producto.descripcion,
                        caracteristicas: item.producto.caracteristicas,
                        cantidad: item.producto.cantidad,
                        foto_producto: item.producto.foto_producto,
                        precio: item.producto.precio,
                        categoria: item.producto.categoria,
                        fecha_creacion: item.producto.fecha_creacion,
                        cantidadProducto: item.cantidadProducto
                    };
                }
            });
        });

        // Convertir el objeto a un array y ordenarlo por la cantidad
        const productosOrdenados = Object.values(productosAgregados).sort((a, b) => b.cantidad - a.cantidad);

        // Devolver los productos más agregados
        res.status(200).json({ productosMasAgregados: productosOrdenados });
    } catch (error) {
        console.error('Error al obtener los productos más agregados:', error);
        res.status(500).json({ error: 'Error al obtener los productos más agregados', details: error.message });
    }
};



module.exports = {
    obtenerProductos,
    crearProducto,
    actualizarProducto,
    eliminarProducto,
    obtenerProductoPorId,
    productosRecientes,
    obtenerProductosMasAgregados
};