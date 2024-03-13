const rateLimit = require("express-rate-limit");

const accountLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, 
    max: 10,
    message: "Demasiadas peticiones realizadas, intenta de nuevo después de 1 hora"
});

module.exports = accountLimiter;
