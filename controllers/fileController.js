const fs = require('fs').promises;
const formidable = require('formidable');

const File = require('../models/fileModel');
const User = require('../models/userModel');
const Status = require('../util/fileStatus');

exports.fileupload = async (req, res) => {
  if (req && req.user && req.user.id) {
    const userId = req.user.id;
    try {
      // Confirm user does exist
      const userDB = await User.findById(userId);
      if (!userDB) {
        return res.status(400).send({ general: 'User does not exists' });
      }

      const form = new formidable.IncomingForm();

      form.parse(req, function (err, fields, files) {
        if (err) {
          return res.status(400).send({ general: 'Error parsing form' });
        }
        const oldpath = files.filetoupload.filepath;
        fs.readFile(oldpath)
          .then((body) => {
            let file = new File({
              owner: userId,
              name: fields.name,
              status: Status.Uploaded,
              body: Buffer.from(body),
              originalFileName: files.filetoupload.originalFilename,
            });
            file
              .save()
              .then((file) => {
                return res.send({ message: 'file uploaded' });
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
  } else {
    return res.status(401).send({ general: 'User not logged in' });
  }
};

exports.filedownload = async (req, res) => {
  if (req && req.user && req.user.id) {
    const userId = req.user.id;

    try {
      // Confirm user does exist
      const userDB = await User.findById(userId);
      if (!userDB) {
        return res.status(400).send({ general: 'User does not exists' });
      }

      if (req.query && req.query.fileId) {
        const { fileId } = req.query;

        try {
          const fileDB = await File.findById(fileId);
          if (!fileDB || fileDB.status !== Status.Zipped) {
            return res
              .status(400)
              .send({ fileId: 'Not found or not compressed' });
          }
          res.setHeader('Content-Type', 'application/zip'); // .zip    application/zip
          return res.status(200).send(fileDB.body);
        } catch (err) {
          return res.status(500).send({ general: 'Database error' });
        }
      } else {
        return res.status(500).send({ general: 'Param fileId needed' });
      }
    } catch (err) {
      return res.status(500).send({ general: 'Internal server error' });
    }
  } else {
    return res.status(401).send({ general: 'User not logged in' });
  }
};

exports.getfiles = async (req, res) => {
  if (req && req.user && req.user.id) {
    const userId = req.user.id;

    try {
      // Confirm user does exist
      const userDB = await User.findById(userId);
      if (!userDB) {
        return res.status(400).send({ general: 'User does not exists' });
      }

      // get files
      const files = await File.find({ owner: userId }).select(
        '_id name status originalFilename createdAt'
      );
    } catch (err) {
      return res.status(500).send({ general: 'Database error' });
    }
  } else {
  }
};
