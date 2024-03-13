const Carrito = require("../models/Carritos.models");
const Producto = require("../models/Productos.models");
const { v4: uuidv4 } = require("uuid");

const obtenerCarritos = async (req, res) => {
  try {
    const carritos = await Carrito.find();
    res.status(200).json(carritos);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

const obtenerCarritoPorId = async (req, res) => {
  try {
    const carrito = await Carrito.findById(req.params.id);
    if (carrito) {
      res.status(200).json(carrito);
    } else {
      res.status(404).json({ message: "Carrito no encontrado" });
    }
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

const crearCarrito = async (req, res) => {
  try {
    const id_carrito = uuidv4();
    const producto = await Producto.findOne({
      id_producto: req.body.productos[0].producto.id_producto,
    });
    const cantidad = req.body.productos[0].cantidadProducto;

    if (!producto) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }

    const nuevoCarrito = await Carrito.create({
      id_carrito: id_carrito,
      productos: [
        {
          producto: producto,
          cantidadProducto: cantidad,
        },
      ],
      id_usuario: req.body.id_usuario,
      cantidad_productos: cantidad,
      monto_total: cantidad * producto.precio,
    });

    res.status(201).json(nuevoCarrito);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const agregarProductoAlCarrito = async (req, res) => {
  try {
    const { id_usuario, id_producto } = req.params;
    const cantidadProducto = req.body.cantidadProducto;

    // Busca si hay un carrito existente para el usuario
    let carritoExistente = await Carrito.findOne({ id_usuario });

    // Si no hay carrito para el usuario, crea uno nuevo
    if (!carritoExistente) {
      const id_carrito = uuidv4();
      carritoExistente = await Carrito.create({
        id_carrito,
        productos: [],
        id_usuario,
        cantidad_productos: 0,
        monto_total: 0,
      });
    }

    const productoEncontrado = await Producto.findOne({ id_producto });
    if (!productoEncontrado) {
      return res.status(404).json({ message: "Producto no encontrado." });
    }

    if (!cantidadProducto) {
      return res.status(400).json({ message: "La cantidad del producto es inválida." });
    }

    const productoExistenteIndex = carritoExistente.productos.findIndex(item => item.producto.id_producto === id_producto);
    if (productoExistenteIndex !== -1) {
      carritoExistente.productos[productoExistenteIndex].cantidadProducto += cantidadProducto;
    } else {
      carritoExistente.productos.push({ producto: productoEncontrado, cantidadProducto });
    }

    carritoExistente.cantidad_productos += cantidadProducto;
    carritoExistente.monto_total += cantidadProducto * productoEncontrado.precio;

    const carritoActualizado = await carritoExistente.save();
    
    res.status(200).json(carritoActualizado);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


const actualizarCarrito = async (req, res) => {
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

const eliminarProductoDelCarrito = async (req, res) => {
  try {
    const idUsuario = req.params.id;
    const id_producto = req.body.idProducto; 

    const carrito = await Carrito.findOne({ id_usuario: idUsuario });

    const productoAEliminar = carrito.productos.find(producto => producto._id == id_producto);

    if (!productoAEliminar) {
      return res.status(404).json({ message: "Producto no encontrado en el carrito." });
    }

    const cantidadProductoEliminada = productoAEliminar.cantidadProducto;

    carrito.productos = carrito.productos.filter(producto => producto._id != id_producto);
    carrito.cantidad_productos -= cantidadProductoEliminada;
    carrito.monto_total -= cantidadProductoEliminada * productoAEliminar.producto.precio;

    await carrito.save();

    res.status(200).json(carrito);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  obtenerCarritos,
  obtenerCarritoPorId,
  crearCarrito,
  actualizarCarrito,
  eliminarProductoDelCarrito,
  agregarProductoAlCarrito
};
