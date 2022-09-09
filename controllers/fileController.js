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
              originalFilename: files.filetoupload.originalFilename,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
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
        '_id name status body originalFilename createdAt updatedAt'
      );
      const filesSend = [];
      for (let i = 0; i < files.length; i++) {
        filesSend.push({
          id: files[i]._id,
          name: files[i].name,
          originalFilename: files[i].originalFilename,
          status: files[i].status,
          size: files[i].body.byteLength,
          createdAt: files[i].createdAt,
          updatedAt: files[i].updatedAt,
        });
      }
      return res.send(filesSend);
    } catch (err) {
      return res.status(500).send({ general: 'Database error' });
    }
  } else {
    return res.status(401).send({ general: 'User not logged in' });
  }
};

exports.getallfiles = async (req, res) => {
  if (req && req.user && req.user.id) {
    const userId = req.user.id;

    try {
      // Confirm user does exist
      const userDB = await User.findById(userId);
      if (!userDB) {
        return res.status(400).send({ general: 'User does not exists' });
      }

      // get files
      const files = await File.find({ status: Status.Zipped })
        .populate('owner')
        .select(
          '_id name status body originalFilename createdAt updatedAt owner'
        );
      const filesSend = [];
      for (let i = 0; i < files.length; i++) {
        filesSend.push({
          id: files[i]._id,
          name: files[i].name,
          originalFilename: files[i].originalFilename,
          status: files[i].status,
          size: files[i].body.byteLength,
          owner: files[i].owner.name,
          createdAt: files[i].createdAt,
          updatedAt: files[i].updatedAt,
        });
      }
      return res.send(filesSend);
    } catch (err) {
      return res.status(500).send({ general: 'Database error' });
    }
  } else {
    return res.status(401).send({ general: 'User not logged in' });
  }
};

exports.updatefile = async (req, res) => {
  if (req && req.user && req.user.id) {
    const userId = req.user.id;

    try {
      // Confirm user does exist
      const userDB = await User.findById(userId);
      if (!userDB) {
        return res.status(400).send({ general: 'User does not exists' });
      }

      if (req.body && req.body.fileId && req.body.name) {
        const fileId = req.body.fileId;

        // get file
        let file = await File.findById(fileId).select('_id name status owner');
        if (!file) {
          return res.status(400).send({ general: 'File does not exists' });
        }
        if (!file.owner.equals(userDB._id)) {
          return res.status(401).send({ general: 'Unauthorized' });
        }

        file.name = req.body.name;
        file.updatedAt = new Date().toISOString();
        file = await file.save();

        return res.send({ name: file.name, updatedAt: file.updatedAt });
      } else {
        return res.status(500).send({ general: 'fileId and name required' });
      }
    } catch (err) {
      return res.status(500).send({ general: 'Database error' });
    }
  } else {
    return res.status(401).send({ general: 'User not logged in' });
  }
};

exports.deletefile = async (req, res) => {
  if (req && req.user && req.user.id) {
    const userId = req.user.id;

    try {
      // Confirm user does exist
      const userDB = await User.findById(userId);
      if (!userDB) {
        return res.status(400).send({ general: 'User does not exists' });
      }

      if (req.body && req.body.fileId) {
        const fileId = req.body.fileId;

        // get file
        let file = await File.findById(fileId).select('_id owner');
        if (!file) {
          return res.status(400).send({ general: 'File does not exists' });
        }
        if (!file.owner.equals(userDB._id)) {
          return res.status(401).send({ general: 'Unauthorized' });
        }

        await File.deleteOne({ _id: fileId });

        return res.send({ general: 'File deleted' });
      } else {
        return res.status(500).send({ general: 'fileId required' });
      }
    } catch (err) {
      return res.status(500).send({ general: 'Database error' });
    }
  } else {
    return res.status(401).send({ general: 'User not logged in' });
  }
};
