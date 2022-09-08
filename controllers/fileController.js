const fs = require('fs');
const path = require('path');
const formidable = require('formidable');

const File = require('../models/fileModel');
const Status = require('../util/fileStatus');

exports.fileupload = async (req, res) => {
    try {
        const form = new formidable.IncomingForm();
      
        form.parse(req, function (err, fields, files) {
          const oldpath = files.filetoupload.filepath;
          let file = new File({
            name: files.filetoupload.originalFilename,
            status: Status.Uploaded,
            body: fs.readFileSync(oldpath),
          });
          file = await file.save();
      
          return res.send({ message: JSON.stringify(fields) });
        })
    } catch(err) {
        return res.status(500).send({ general: 'Internal server error' });
    }
    // const newpath = path.join(
    //   __dirname,
    //   '/../',
    //   '/files/',
    //   files.filetoupload.originalFilename
    // );
    // fs.rename(oldpath, newpath, function (err) {
    //   if (err) {
    //     console.log(err);
    //     return res.status(400).send({ error: err });
    //   }
    //   return res.send({ message: 'File uploaded and moved' });
    // });
  
};
