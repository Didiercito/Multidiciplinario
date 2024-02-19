const express = require('express')
const router = express.Router();
const authController = require('../controllers/auth.controller');
const VerificarJWT = require('../middleware/auth.middleware');

router.post('/signup', authController.signup);
router.post('/signin', VerificarJWT, authController.signin);

module.exports = router;
