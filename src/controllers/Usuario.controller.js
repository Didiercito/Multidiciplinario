const Usuario = require('../models/Usuarios.models');
const Carrito = require('../models/Carritos.models');
const Producto = require('../models/Productos.models');


const crearUsuario = async (req, res) => {
  try {
    // Verificar si ya existe un usuario con el mismo id_usuario
    const usuarioExistente = await Usuario.findOne({ id_usuario: req.body.id_usuario });
    if (usuarioExistente) {
      return res.status(400).json({ error: 'El id_usuario ya está en uso' });
    }

    // Crear el nuevo usuario solo si no existe uno con el mismo id_usuario
    const nuevoUsuario = await Usuario.create(req.body);
    
    res.status(201).json({ usuario: nuevoUsuario });
  } catch (error) {
    console.error('Error al crear el usuario:', error);
    res.status(500).json({ error: 'Error al crear el usuario' });
  }
};



const obtenerUsuarios = async (req, res) => {
  try {
    const usuarios = await Usuario.find({}, '-_id id_usuario nombre apellido correo telefono usuario foto_perfil contrasena rolName')
      .populate({
        path: 'carrito',
        populate: {
          path: 'productos.id_producto',
          model: 'Producto',
          select: 'id_producto, nombre, descripcion, precio, caracteristicas,foto_producto, categoria, cantidad '
        }
      });
    res.json({ usuarios });
  } catch (error) {
    console.error('Error al obtener los usuarios:', error);
    res.status(500).json({ error: 'Error al obtener los usuarios' });
  }
};

const obtenerUsuarioPorId = async (req, res) => {
  try {
    const usuario = await Usuario.findOne({ id_usuario: req.params.id_usuario })
      .populate({
        path: 'carrito',
        populate: {
          path: 'productos.id_producto',
          model: 'Producto',
          select: 'id_producto nombre descripcion precio caracteristicas foto_producto categoria cantidad'
        }
      });

    if (!usuario) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    }

    res.json({ usuario });
  } catch (error) {
    console.error('Error al obtener el usuario:', error);
    res.status(500).json({ error: 'Error al obtener el usuario' });
  }
};




const actualizarUsuario = async (req, res) => {
  try {
    const usuarioActualizado = await Usuario.findOneAndUpdate({ id_usuario: req.params.id }, req.body, { new: true });
    if (!usuarioActualizado) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    }
    res.json({ usuario: usuarioActualizado });
  } catch (error) {
    console.error('Error al actualizar el usuario:', error);
    res.status(500).json({ error: 'Error al actualizar el usuario' });
  }
};

const eliminarUsuario = async (req, res) => {
  try {
    const usuarioEliminado = await Usuario.findOneAndDelete({ id_usuario: req.params.id });
    if (!usuarioEliminado) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    }
    res.json({ mensaje: 'Usuario eliminado correctamente' });
  } catch (error) {
    console.error('Error al eliminar el usuario:', error);
  }
};

const agregarProductoAlCarrito = async (req, res) => {
  const { id_usuario, id_carrito, id_producto } = req.params;

  try {
    const usuario = await Usuario.findOne({ id_usuario });
    if (!usuario) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    }

    const producto = await Producto.findOne({ id_producto });
    if (!producto) {
      return res.status(404).json({ mensaje: 'Producto no encontrado' });
    }

    let carrito = await Carrito.findOne({ id_usuario, id_carrito });
    if (!carrito) {
      carrito = await Carrito.create({ id_carrito, id_usuario });
      usuario.carrito.push(carrito._id);
      await usuario.save();
    }

    carrito.productos.push(producto);
    await carrito.save();

    producto.cantidad--;
    await producto.save();

    res.status(200).json({ mensaje: `Producto agregado al carrito de ${usuario.nombre} correctamente`, producto });
  } catch (error) {
    console.error('Error al agregar producto al carrito:', error);
    res.status(500).json({ error: 'Error al agregar producto al carrito' });
  }
};


module.exports = {
  crearUsuario,
  obtenerUsuarios,
  obtenerUsuarioPorId,
  actualizarUsuario,
  eliminarUsuario,
  agregarProductoAlCarrito
};
