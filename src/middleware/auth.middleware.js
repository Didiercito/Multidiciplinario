// const jwt = require('jsonwebtoken');
// const secretKey = process.env.JWT_SECRET;

// async function verificarToken(req, res, next) {
//     const token = req.headers['authorization'];
//     if (typeof token !== 'undefined') {
//         const tokenString = token.split(' ')[1];
//         jwt.verify(tokenString, secretKey, (err, decoded) => {
//             if (err) {
//                 return res.status(403).json({ message: 'Token inválido' });
//             }
//             req.user = decoded;

//             if (req.user.id_rol !== '1') { 
//                 return res.status(403).json({ message: 'No tienes permisos para hacer esta acción' });
//             }

//             next();
//         });
//     } else {
//         res.status(403).json({ message: 'Token no proporcionado' });
//     }
// }

// module.exports = verificarToken;
