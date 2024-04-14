const Usuario = require('../models/Usuarios.models');
const Carrito = require('../models/Carritos.models');
const Producto = require ('../models/Productos.models');

const obtenerUsuarios = async (req, res) => {
  try {
    if (req.usuario && req.usuario.roles.includes('Administrador')) {
      const usuarios = await Usuario.find({}, '-_id id_usuario nombre apellido correo telefono usuario foto_perfil contrasena rolName');

      const usuariosConCarrito = [];
      for (const usuario of usuarios) {
        const carritos = await Carrito.find({ id_usuario: usuario.id_usuario });
        const carritosConProductos = [];

        for (const carrito of carritos) {
          const productos = [];
          let monto_total = 0;
          let totalProductos = 0;
          for (const productoEnCarrito of carrito.productos) {
            const producto = await Producto.findOne({ _id: productoEnCarrito.producto });
            if (producto) {
              productos.push({
                id_producto: producto.id_producto,
                nombre: producto.nombre,
                descripcion: producto.descripcion,
                precio: producto.precio,
                caracteristicas: producto.caracteristicas,
                foto_producto: producto.foto_producto,
                categoria: producto.categoria,
                cantidad: producto.cantidad,
                cantidadProducto: productoEnCarrito.cantidadProducto
              });
              monto_total += producto.precio * productoEnCarrito.cantidadProducto;
              totalProductos += productoEnCarrito.cantidadProducto;
            }
          }

          carritosConProductos.push({
            id_carrito: carrito.id_carrito,
            productos: productos,
            monto_total: monto_total,
            totalProductos: totalProductos 
          });
        }

        usuariosConCarrito.push({
          id_usuario: usuario.id_usuario,
          nombre: usuario.nombre,
          apellido: usuario.apellido,
          correo: usuario.correo,
          telefono: usuario.telefono,
          usuario: usuario.usuario,
          foto_perfil: usuario.foto_perfil,
          carrito: carritosConProductos
        });
      }

      res.json({ usuarios: usuariosConCarrito });
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
    const usuarioEliminado = await Usuario.findOneAndDelete({ id_usuario: req.params.id_usuario });
    if (!usuarioEliminado) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    }

    await Carrito.findOneAndDelete({ id_usuario: req.params.id_usuario });

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
