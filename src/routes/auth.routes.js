    const express = require('express')
    const router = express.Router();
    const authController = require('../controllers/auth.controller');
    const VerificarJWT = require('../middleware/auth.middleware');
    const accountLimiter = require('../middleware/rateLimit.middleware')

    router.post('/signup', authController.signup);
    router.post('/signin',accountLimiter ,VerificarJWT, authController.signin);

    module.exports = router;
