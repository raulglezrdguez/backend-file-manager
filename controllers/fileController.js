const fs = require('fs');
const formidable = require('formidable');

const File = require('../models/fileModel');
const Status = require('../util/fileStatus');

exports.fileupload = async (req, res) => {
  try {
    const form = new formidable.IncomingForm();

    form.parse(req, function (err, fields, files) {
      const oldpath = files.filetoupload.filepath;
      let file = new File({
        name: fields.name,
        status: Status.Uploaded,
        body: fs.readFileSync(oldpath),
        originalFileName: files.filetoupload.originalFilename,
      });
      file
        .save()
        .then((file) => {
          return res.send({ message: JSON.stringify(fields) });
        })
        .catch((err) => {
          return res
            .status(400)
            .send({ general: 'Server error: saving file document' });
        });
    });
  } catch (err) {
    return res.status(500).send({ general: 'Internal server error' });
  }
};
