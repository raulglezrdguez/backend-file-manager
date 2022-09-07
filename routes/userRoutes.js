const express = require('express');

const authController = require('../controllers/authController');

const router = express.Router();

router.post('/signup', authController.signUp);
router.post('/activate', authController.activate);
router.post('/login', authController.login);
router.post('/forgotpass', authController.forgotpass);
router.post('/recoverypass', authController.recoverypass);

module.exports = router;
