// require('dotenv').config();
// const bcrypt = require('bcrypt');
// const mongoose = require('mongoose');
// const Usuario = require('../models/Usuarios.models');
// const saltosBcrypt = parseInt(process.env.SALTOS_BCRYPT);

// async function seedUsuario() {
//     try {
//         await mongoose.connect(process.env.MONGO_URI, {
//             useNewUrlParser: true,
//             useUnifiedTopology: true
//         });

//         const administrador = {
//             usuario: 'admin',
//             contrasena: await bcrypt.hash('Administrador', saltosBcrypt),
//             nombre: 'NombreAdmin',
//             apellido: 'ApellidoAdmin',
//             correo: 'admin@example.com',
//             telefono: '1234567890',
//             id_rol: 'rol_admin',
//             foto_perfil: 'ruta/a/la/foto.jpg'
//         };

//         await Usuario.create(administrador);

//         console.log('Usuario administrador insertado exitosamente.');
//     } catch (error) {
//         console.error('Error al insertar usuario administrador:', error);
//     } finally {
//         mongoose.disconnect();
//     }
// }

// seedUsuario().then(() => {
//     console.log('Proceso de sembrado completado.');
//     process.exit(0); 
// }).catch((error) => {
//     console.error('Error durante el proceso de sembrado:', error);
//     process.exit(1); 
// });

// module.exports = seedUsuario;
