var express = require('express');
var router = express.Router();
const authController = require('../controllers/auth');

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/verify-token', authController.verifyToken);
router.post('/refresh-token', authController.refreshToken);

module.exports = router;
