const rateLimit = require("express-rate-limit");

const accountLimiter = rateLimit({
    windowMs: 60 * 1000, 
    max: 6,
    message: "Demasiadas peticiones realizadas, intenta de nuevo después de 1 minuto"
});



module.exports = accountLimiter;
