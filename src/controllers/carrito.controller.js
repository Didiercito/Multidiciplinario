const Carrito = require("../models/Carritos.models");
const Producto = require("../models/Productos.models");
const { v4: uuidv4 } = require("uuid");

const getCarritos = async (req, res) => {
  try {
    const carritos = await Carrito.find();
    res.status(200).json(carritos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


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

const createCarrito = async (req, res) => {
  try {
    const id_carrito = uuidv4();
    const producto = await Producto.findOne({
      id_Producto: req.body.productos.producto,
    });
    const can = req.body.productos[0].cantidadProducto;

    if (!producto) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }

    const nuevoCarrito = await Carrito.create({
      id_carrito: id_carrito,
      productos: [
        {
          producto: producto,
          cantidadProducto: can,
        },
      ],
      id_usuario: req.body.id_usuario,
    });

    res.status(201).json(nuevoCarrito);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const addProductoToCarrito = async (req, res) => {
  try {
    const { id_carrito, id_usuario } = req.body;

    const carritoExistente = await Carrito.findOne({ id_carrito, id_usuario });
    if (!carritoExistente) {
      return res.status(404).json({ message: "Carrito no encontrado para este usuario." });
    }

    const { producto, cantidadProducto } = req.body.productos[0]; 
    
    if (!cantidadProducto) {
      return res.status(400).json({ message: "La cantidad del producto es inválida." });
    }

    const productoEncontrado = await Producto.findOne({ id_producto: producto });
    if (!productoEncontrado) {
      return res.status(404).json({ message: "Producto no encontrado." });
    }

    const productoExistenteIndex = carritoExistente.productos.findIndex(item => item.producto.id_producto === producto);
    if (productoExistenteIndex !== -1) {
      carritoExistente.productos[productoExistenteIndex].cantidadProducto += cantidadProducto;
    } else {
      carritoExistente.productos.push({ producto: productoEncontrado, cantidadProducto });
    }

    
    const carritoActualizado = await carritoExistente.save();
    
    res.status(200).json(carritoActualizado);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


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


const eliminarProductoDelCarrito = async (req, res) => {
  try {
    const idUsuario = req.params.id;
    const id_producto = req.body.idProducto; 

    const carrito = await Carrito.findOne({ id_usuario: idUsuario });

  
    carrito.productos = carrito.productos.filter(
      (producto) => producto._id != id_producto
    );


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

module.exports = {
  getCarritos,
  getCarritoById,
  createCarrito,
  updateCarrito,
  eliminarProductoDelCarrito,
  addProductoToCarrito
};
