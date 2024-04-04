const Usuario = require('../models/Usuarios.models');

const obtenerUsuarios = async (req, res) => {
  try {
      if (req.usuario && req.usuario.roles.includes('Administrador')) {
          const usuarios = await Usuario.find({}, '-_id id_usuario nombre apellido correo telefono usuario foto_perfil contrasena rolName')
              .populate({
                  path: 'carrito.productos.producto',
                  model: 'Producto',
                  select: 'id_producto nombre descripcion precio caracteristicas foto_producto categoria cantidad'
              });
          res.json({ usuarios });
      } else {
          return res.status(403).json({ mensaje: 'Acceso denegado: Se requiere el rol de Administrador para realizar esta acción.' });
      }
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
          path: 'productos.producto', 
          model: 'Producto',
          select: 'id_producto nombre descripcion precio caracteristicas foto_producto categoria cantidad'
        }
      });

    if (!usuario) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    }

    const carritoConProductos = usuario.carrito.map(item => ({
      id_carrito: item.id_carrito,
      productos: item.productos.map(producto => ({
        id_producto: producto.producto.id_producto,
        nombre: producto.producto.nombre,
        descripcion: producto.producto.descripcion,
        precio: producto.producto.precio,
        foto_producto: producto.producto.foto_producto,
        cantidadProducto: producto.cantidadProducto
      })),
      id_usuario: item.id_usuario,
      cantidad_productos: item.cantidad_productos,
      monto_total: item.monto_total
    }));

    usuario.carrito = carritoConProductos;

    res.json({ usuario });
  } catch (error) {
    console.error('Error al obtener el usuario:', error);
    res.status(500).json({ error: 'Error al obtener el usuario' });
  }
};



const actualizarUsuario = async (req, res) => {
  try {
    const usuarioActualizado = await Usuario.findOneAndUpdate({ id_usuario: req.params.id_usuario }, req.body, { new: true });
    if (!usuarioActualizado) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    }
    res.json({ mensaje: 'Usuario Actualizado correctamente', usuario: usuarioActualizado });
  } catch (error) {
    console.error('Error al actualizar el usuario:', error);
    res.status(500).json({ error: 'Error al actualizar el usuario' });
  }
};


const eliminarUsuario = async (req, res) => {
  try {
    const usuarioEliminado = await Usuario.findOneAndDelete({ id_usuario: req.params.id_usuario }, {new: true});
    if (!usuarioEliminado) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    }
    res.json({ mensaje: 'Usuario eliminado correctamente', usuario: usuarioEliminado });
  } catch (error) {
    console.error('Error al eliminar el usuario:', error);
    res.status(500).json({ error: 'Error al eliminar el usuario' });
  }
};


module.exports = {
  obtenerUsuarios,
  obtenerUsuarioPorId,
  actualizarUsuario,
  eliminarUsuario,
};
