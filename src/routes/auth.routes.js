    const express = require('express')
    const router = express.Router();
    const authController = require('../controllers/auth.controller');
    const VerificarJWT = require('../middleware/auth.middleware');
    const accountLimiterSignin = require('../middleware/rateLimit.middleware')

    router.post('/signup', authController.signup);
    router.post('/signin',accountLimiterSignin ,VerificarJWT, authController.signin);

    module.exports = router;
