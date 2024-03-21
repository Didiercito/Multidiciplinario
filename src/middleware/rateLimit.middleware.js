const rateLimit = require("express-rate-limit");

const accountLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, 
    max: 6,
    message: "Demasiadas peticiones realizadas, intenta de nuevo después de 1 hora"
});


const accountLimiterSignin = rateLimit({
    windowMs: 120000,
    max: 6,
    message: "Demasiados intentos intenta despues de 2 minutos"

});


module.exports = accountLimiter;
