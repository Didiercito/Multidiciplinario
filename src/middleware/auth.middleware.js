const jwt = require('jsonwebtoken');
require('dotenv').config();
const jwtSecret = process.env.JWT_SECRET;

const VerificarJWT = (req, res, next) => {
    const authorizationHeader = req.headers['authorization'];

    if (!authorizationHeader) {
        return next(); 
    }

    const tokenParts = authorizationHeader.split(' ');
    if (tokenParts.length !== 2 || tokenParts[0] !== 'Bearer') {
        return res.status(401).json({
            message: 'Error al validar el token',
            error: 'Formato de token inválido'
        });
    }
    
    const token = tokenParts[1];
    
    jwt.verify(token, jwtSecret, (err, decoded) => {
        if (err) {
            console.error(err); 
            return res.status(401).json({
                message: 'Error al validar el token',
                error: 'Token inválido'
            });
        }
        
        req.usuario = decoded;
        next();
    });
};

module.exports = VerificarJWT;
