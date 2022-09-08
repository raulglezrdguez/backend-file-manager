const express = require('express');

const fileController = require('../controllers/fileController');

const router = express.Router();

router.post('/upload', fileController.fileupload);
router.get('/download', fileController.filedownload);

module.exports = router;
