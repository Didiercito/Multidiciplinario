const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Rol = require('../models/Rol.models');
const Usuario = require('../models/Usuarios.models');

const URILocal = 'mongodb://localhost:27017/Multi';

async function connectDB() {
    try {
        await mongoose.connect(URILocal, { useNewUrlParser: true, useUnifiedTopology: true });
        console.log('Conexión exitosa con la base de datos local');

        await Rol.deleteMany({});
        console.log('Colección de roles eliminada');

        const roles = [
            { name: 'Administrador' },
            { name: 'Usuario' }
        ];

        await Rol.insertMany(roles);
        console.log('Roles creados');

        const existingAdmin = await Usuario.findOne({ usuario: 'admin' });

        if (existingAdmin) {
            console.log('El usuario Administrador ya existe');

            const adminRole = await Rol.findOne({ name: 'Administrador' });
            existingAdmin.roles = [adminRole._id];
            await existingAdmin.save();
        } else {
            const adminRole = await Rol.findOne({ name: 'Administrador' });
            const hashedPassword = await bcrypt.hash('didi', 10);
            const Administrador = {
                id_usuario: '1123',
                nombre: 'Admin',
                apellido: 'Admin',
                correo: 'admin@example.com',
                contrasena: hashedPassword,
                telefono: '123456789',
                usuario: 'admin',
                foto_perfil: 'default.jpg',
                carrito: [],
                roles: [adminRole._id]
            };

            await Usuario.create(Administrador);
            console.log('Nuevo usuario "Administrador" creado exitosamente');
        }
    } catch (error) {
        console.error('Error al conectar a la base de datos local:', error);
    }
}

module.exports = connectDB;
