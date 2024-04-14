const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const { v4: uuidv4 } = require("uuid");
const jwtSecret = process.env.JWT_SECRET;
const Usuario = require('../models/Usuarios.models');
const Rol = require('../models/Rol.models');
const Carrito = require ('../models/Carritos.models');


const signup = async (req, res) => {
    try {
        const { id_usuario, nombre, apellido, correo, contrasena, telefono, usuario, foto_perfil } = req.body;

        const existingUser = await Usuario.findOne({ correo });

        if (existingUser) {
            return res.status(400).json({ error: 'El usuario ya existe' });
        }

        const hashedPassword = await bcrypt.hash(contrasena, 10);

        const userRole = await Rol.findOne({ name: 'Usuario' });

        const newUser = new Usuario({
            id_usuario,
            nombre,
            apellido,
            correo,
            contrasena: hashedPassword,
            telefono,
            usuario,
            foto_perfil,
            roles: [userRole._id]
        });

        await newUser.save();

        const id_carrito  = uuidv4();
        const nuevoCarritoUsuario = new Carrito({
            id_carrito,
            productos:[],
            id_usuario: newUser.id_usuario,
            cantidad_productos: 0,
            monto_total: 0
        });

        await nuevoCarritoUsuario.save();

        res.status(201).json({ message: 'Usuario registrado exitosamente' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al crear Usuario' });
    }
};

const signin = async (req, res) => {
    const { usuario, contrasena } = req.body;

    try {
        const user = await Usuario.findOne({ usuario }).populate('roles');

        if (!user) {
            return res.status(401).json({ error: 'Credenciales incorrectas' });
        }

        const passwordMatch = await bcrypt.compare(contrasena, user.contrasena);

        if (!passwordMatch) {
            return res.status(401).json({ error: 'Credenciales incorrectas' });
        }

        let roles = [];
        if (user.roles.length > 0) {
            roles = user.roles.map(role => role.name);
        }

        const token = jwt.sign({ id: user._id, roles }, jwtSecret, { expiresIn: '10h' });

        res.json({ 
            message: 'Inicio de sesión correcto', 
            token,
            id_usuario: user.id_usuario
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al iniciar sesión' });
    }
}


module.exports = { 
    signup, 
    signin 
};
