const express = require('express');

const authController = require('../controllers/authController');

const router = express.Router();

router.post('/signup', authController.signUp);
router.post('/activate', authController.activate);
router.post('/forgotpass', authController.forgotpass);

module.exports = router;
