const Usuario = require('../models/Usuarios.models');
const Carrito = require('../models/Carritos.models');
const Producto = require('../models/Productos.models');

const obtenerUsuarios = async (req, res) => {
  try {
    if (!req.usuario || !req.usuario.roles.includes('Administrador')) {
      return res.status(403).json({ mensaje: 'Acceso denegado: Se requiere el rol de Administrador para realizar esta acción.' });
    }

    const usuarios = await Usuario.find({}, '-_id id_usuario nombre apellido correo telefono usuario foto_perfil contrasena rolName');

    const usuariosConCarrito = await Promise.all(usuarios.map(async (usuario) => {
      const carritos = await Carrito.find({ id_usuario: usuario.id_usuario });

      const carritosConProductos = await Promise.all(carritos.map(async (carrito) => {
        let monto_total = 0;
        let totalProductos = 0;

        const productos = await Promise.all(carrito.productos.map(async (productoEnCarrito) => {
          const producto = await Producto.findOne({ _id: productoEnCarrito.producto });

          if (producto) {
            monto_total += producto.precio * productoEnCarrito.cantidadProducto;
            totalProductos += productoEnCarrito.cantidadProducto;

            return {
              id_producto: producto.id_producto,
              nombre: producto.nombre,
              descripcion: producto.descripcion,
              precio: producto.precio,
              caracteristicas: producto.caracteristicas,
              foto_producto: producto.foto_producto,
              categoria: producto.categoria,
              cantidad: producto.cantidad,
              cantidadProducto: productoEnCarrito.cantidadProducto
            };
          }
        }));

        return {
          id_carrito: carrito.id_carrito,
          productos: productos,
          monto_total: monto_total,
          totalProductos: totalProductos
        };
      }));

      return {
        id_usuario: usuario.id_usuario,
        nombre: usuario.nombre,
        apellido: usuario.apellido,
        correo: usuario.correo,
        telefono: usuario.telefono,
        usuario: usuario.usuario,
        foto_perfil: usuario.foto_perfil,
        contrasena: usuario.contrasena,
        carrito: carritosConProductos
      };
    }));

    res.json({ usuarios: usuariosConCarrito });
  } catch (error) {
    console.error('Error al obtener los usuarios:', error);
    res.status(500).json({ error: 'Error al obtener los usuarios' });
  }
};

const obtenerUsuarioPorId = async (req, res) => {
  try {
    const usuario = await Usuario.findOne({ id_usuario: req.params.id_usuario });

    if (!usuario) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    }

    const carritos = await Carrito.find({ id_usuario: usuario.id_usuario });

    const carritosConProductos = await Promise.all(carritos.map(async (carrito) => {
      let totalProductosCarrito = 0;

      const productos = await Promise.all(carrito.productos.map(async (productoEnCarrito) => {
        const producto = await Producto.findOne({ _id: productoEnCarrito.producto });

        if (producto) {
          totalProductosCarrito += productoEnCarrito.cantidadProducto;

          return {
            id_producto: producto.id_producto,
            nombre: producto.nombre,
            descripcion: producto.descripcion,
            precio: producto.precio,
            foto_producto: producto.foto_producto,
            cantidadProducto: productoEnCarrito.cantidadProducto
          };
        }
      }));

      return {
        id_carrito: carrito.id_carrito,
        productos: productos,
        monto_total: carrito.monto_total,
        totalProductos: totalProductosCarrito
      };
    }));

    const totalProductosUsuario = carritosConProductos.reduce((total, carrito) => total + carrito.totalProductos, 0);

    const usuarioConCarrito = {
      id_usuario: usuario.id_usuario,
      nombre: usuario.nombre,
      apellido: usuario.apellido,
      correo: usuario.correo,
      telefono: usuario.telefono,
      usuario: usuario.usuario,
      foto_perfil: usuario.foto_perfil,
      contrasena: usuario.contrasena,
      carrito: carritosConProductos,
      totalProductos: totalProductosUsuario
    };

    res.json({ usuario: usuarioConCarrito });
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
