const Carrito = require("../models/Carritos.models");
const Producto = require("../models/Productos.models");
const Usuario = require('../models/Usuarios.models');

const obtenerCarritosConProductos = async (req, res) => {
  try {
    const carritos = await Carrito.find().populate('productos.producto');

    if (!carritos || carritos.length === 0) {
      return res.status(404).json({ message: "No se encontraron carritos con productos." });
    }

    // Mapear los carritos para ajustar la estructura de los productos
    const carritosConProductos = carritos.map(carrito => ({
      _id: carrito._id,
      id_carrito: carrito.id_carrito,
      id_usuario: carrito.id_usuario,
      cantidad_productos: carrito.cantidad_productos,
      monto_total: carrito.monto_total,
      __v: carrito.__v,
      productos: carrito.productos.map(item => ({
        producto: {
          _id: item.producto._id,
          id_producto: item.producto.id_producto,
          nombre: item.producto.nombre,
          descripcion: item.producto.descripcion,
          caracteristicas: item.producto.caracteristicas,
          cantidad: item.producto.cantidad,
          foto_producto: item.producto.foto_producto,
          precio: item.producto.precio,
          categoria: item.producto.categoria,
          fecha_creacion: item.producto.fecha_creacion,
          __v: item.producto.__v
        },
        cantidadProducto: item.cantidadProducto,
        _id: item._id
      }))
    }));

    res.status(200).json({ carritos: carritosConProductos });
  } catch (error) {
    res.status(500).json({ message: "Error al obtener los carritos con productos.", error: error.message });
  }
};

const buscarCarritoPorIdUsuario = async (req, res) => {
  try {
    const id_usuario = req.params.id_usuario;

    const carrito = await Carrito.findOne({ id_usuario }).populate('productos.producto');

    if (!carrito) {
      return res.status(404).json({ message: "Carrito no encontrado para el usuario." });
    }

    // Verificar si hay productos en el carrito y que no sea null
    if (carrito.productos && carrito.productos.length > 0) {
      // Mapear los productos en el carrito para ajustar su estructura
      const productos = carrito.productos.map(item => ({
        producto: {
          _id: item.producto._id,
          id_producto: item.producto.id_producto,
          nombre: item.producto.nombre,
          descripcion: item.producto.descripcion,
          caracteristicas: item.producto.caracteristicas,
          cantidad: item.producto.cantidad,
          foto_producto: item.producto.foto_producto,
          precio: item.producto.precio,
          categoria: item.producto.categoria,
          fecha_creacion: item.producto.fecha_creacion,
          __v: item.producto.__v
        },
        cantidadProducto: item.cantidadProducto,
        _id: item._id
      }));

      // Insertar los productos mapeados en la respuesta del carrito
      carrito.productos = productos;
    }

    res.status(200).json({ carrito });
  } catch (error) {
    res.status(500).json({ message: "Error al buscar el carrito por ID de usuario.", error: error.message });
  }
};

module.exports = {
  obtenerCarritosConProductos,
  buscarCarritoPorIdUsuario
};



const actualizarCarrito = async (req, res) => {
  try {
    const { id_usuario, id_producto, cantidadProducto } = req.params;

    if (!(cantidadProducto > 0)) {
      console.error("La cantidad del producto es inválida.");
      return res.status(400).json({ message: "La cantidad del producto es inválida." });
    }

    const carrito = await Carrito.findOne({ id_usuario });

    if (!carrito) {
      console.error("Carrito no encontrado para el usuario.");
      return res.status(404).json({ message: "Carrito no encontrado para el usuario." });
    }

    const productoEnCarrito = carrito.productos.find(item => item.producto.toString() === id_producto);

    if (!productoEnCarrito) {
      console.error("Producto no encontrado en el carrito.");
      return res.status(404).json({ message: "Producto no encontrado en el carrito." });
    }

    const producto = await Producto.findById(id_producto);

    if (!producto) {
      console.error("Producto no encontrado en la base de datos.");
      return res.status(404).json({ message: "Producto no encontrado en la base de datos." });
    }

    const cantidadAnterior = productoEnCarrito.cantidadProducto;

    if (cantidadProducto > cantidadAnterior) {
      const cantidadAgregar = cantidadProducto - cantidadAnterior;
      if (cantidadAgregar > producto.cantidad) {
        console.error("Cantidad insuficiente del producto en inventario.");
        return res.status(400).json({ message: "Cantidad insuficiente del producto en inventario." });
      }
      carrito.cantidad_productos += cantidadAgregar;
      carrito.monto_total += cantidadAgregar * producto.precio;
      producto.cantidad -= cantidadAgregar;
    } else if (cantidadProducto < cantidadAnterior) {
      const cantidadEliminar = cantidadAnterior - cantidadProducto;
      carrito.cantidad_productos -= cantidadEliminar;
      carrito.monto_total -= cantidadEliminar * producto.precio;
      producto.cantidad += cantidadEliminar;
    }

    productoEnCarrito.cantidadProducto = cantidadProducto;
    await carrito.save();
    await producto.save();

    res.status(200).json({ message: "Carrito actualizado correctamente", carrito });
  } catch (error) {
    console.error(error.message);
    res.status(400).json({ message: error.message });
  }
};

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

    res.status(200).json({ message: 'Producto agregado al carrito correctamente', id_producto: id_producto, carritoActualizado });
  } catch (error) {
    console.error(error.message);
    res.status(400).json({ message: error.message });
  }
};

const eliminarProductoDelCarrito = async (req, res) => {
  try {
    const { id_usuario, id_producto } = req.params;

    if (!id_producto) {
      return res.status(400).json({ message: "El ID del producto no está definido." });
    }

    const carrito = await Carrito.findOne({ id_usuario });

    if (!carrito) {
      return res.status(404).json({ message: "Carrito no encontrado para el usuario." });
    }

    const productosEnCarrito = carrito.productos.filter(item => item.producto.toString() !== id_producto);

    const productoEliminado = carrito.productos.find(item => item.producto.toString() === id_producto);
    if (!productoEliminado) {
      return res.status(404).json({ message: "Producto eliminado no encontrado en el carrito." });
    }

    const producto = await Producto.findById(id_producto);
    if (!producto) {
      return res.status(404).json({ message: "Producto eliminado no encontrado en la base de datos." });
    }

    producto.cantidad += productoEliminado.cantidadProducto;
    await producto.save();

    carrito.productos = productosEnCarrito;

    carrito.cantidad_productos -= productoEliminado.cantidadProducto;
    carrito.monto_total -= producto.precio * productoEliminado.cantidadProducto;
    carrito.monto_total = Math.max(0, carrito.monto_total);

    await carrito.save();

    res.status(200).json({ message: "Producto eliminado correctamente", id_producto: id_producto, carrito });
  } catch (error) {
    console.error(error.message);
    res.status(400).json({ message: "Error al eliminar el producto del carrito.", error: error.message });
  }
};

const eliminarTodosLosProductosDelCarrito = async (req, res) => {
  try {
    const id_usuario = req.params.id_usuario;

    // Buscar el carrito del usuario por su ID
    const carrito = await Carrito.findOne({ id_usuario });

    if (!carrito) {
      return res.status(404).json({ message: "Carrito no encontrado para el usuario." });
    }

    // Iterar sobre los productos del carrito y restaurar la cantidad al inventario
    for (const producto of carrito.productos) {
      const productoDB = await Producto.findById(producto.producto);
      if (productoDB) {
        productoDB.cantidad += producto.cantidadProducto;
        await productoDB.save();
      }
    }

    // Eliminar todos los productos del carrito
    carrito.productos = [];
    carrito.cantidad_productos = 0;
    carrito.monto_total = 0;

    // Guardar los cambios en el carrito
    await carrito.save();

    // Enviar la respuesta con el carrito actualizado
    res.status(200).json({ message: "Se eliminaron todos los productos del carrito del usuario.", carrito });
  } catch (error) {
    console.error(error.message);
    res.status(400).json({ message: "Error al eliminar todos los productos del carrito del usuario.", error: error.message });
  }
};

module.exports = {
  eliminarProductoDelCarrito,
  agregarProductoAlCarrito,
  obtenerCarritosConProductos,
  buscarCarritoPorIdUsuario,
  actualizarCarrito,
  eliminarTodosLosProductosDelCarrito
};
