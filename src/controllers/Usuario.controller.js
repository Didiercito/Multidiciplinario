const Usuario = require('../models/Usuarios.models');

const obtenerUsuarios = async (req, res) => {
  try {
    if (req.usuario && req.usuario.roles.includes('Administrador')) {
      const usuarios = await Usuario.find({}, '-_id id_usuario nombre apellido correo telefono usuario foto_perfil contrasena rolName')
        .populate({
          path: 'carrito.productos.producto', // Poblamos directamente el producto
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
        path: 'carrito.productos.producto', // Poblamos directamente el producto
        model: 'Producto',
        select: 'id_producto nombre descripcion precio caracteristicas foto_producto categoria cantidad'
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

module.exports = {
  obtenerUsuarios,
  obtenerUsuarioPorId,
  actualizarUsuario,
  eliminarUsuario,
};
