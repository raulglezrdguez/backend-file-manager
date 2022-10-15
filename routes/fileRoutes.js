const express = require('express');

const fileController = require('../controllers/fileController');

const router = express.Router();

router.post('/upload', fileController.fileupload);
router.get('/download', fileController.filedownload);
router.get('/files', fileController.getfiles);
router.get('/allfiles', fileController.getallfiles);
router.patch('/file', fileController.updatefile);
router.delete('/file', fileController.deletefile);

module.exports = router;
