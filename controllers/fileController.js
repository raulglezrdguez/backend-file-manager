const fs = require('fs').promises;
const formidable = require('formidable');

const File = require('../models/fileModel');
const Status = require('../util/fileStatus');

exports.fileupload = async (req, res) => {
  try {
    const form = new formidable.IncomingForm();

    form.parse(req, function (err, fields, files) {
      const oldpath = files.filetoupload.filepath;
      fs.readFile(oldpath)
        .then((body) => {
          let file = new File({
            name: fields.name,
            status: Status.Uploaded,
            body: Buffer.from(body),
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
        })
        .catch((err) => {
          return res
            .status(400)
            .send({ general: 'Server error: reading file' });
        });
    });
  } catch (err) {
    return res.status(500).send({ general: 'Internal server error' });
  }
};

exports.filedownload = async (req, res) => {};
