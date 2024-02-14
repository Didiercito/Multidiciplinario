const jwt = require('jsonwebtoken');
const secretKey = process.env.JWT_SECRET;

function generarTokenAdministrador(usuario) {
    const payload = {
        usuario: usuario.usuario,
        rol: 'administrador'
    };
    return jwt.sign(payload, secretKey, { expiresIn: '8h' });
}

module.exports = {
    generarTokenAdministrador
};
