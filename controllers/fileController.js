const fs = require('fs');
const formidable = require('formidable');

const File = require('../models/fileModel');
const Status = require('../util/fileStatus');

exports.fileupload = async (req, res) => {
  const form = new formidable.IncomingForm();

  form.parse(req, function (err, fields, files) {
    const oldpath = files.filetoupload.filepath;
    const newpath =
      __dirname + '/../files/' + files.filetoupload.originalFilename;
    fs.rename(oldpath, newpath, function (err) {
      if (err) {
        console.log(err);
        return res.status(400).send({ error: err });
      }
      return res.send({ message: 'File uploaded and moved' });
    });
  });
};
