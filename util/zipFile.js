const compressing = require('compressing');
const File = require('../models/fileModel');
const Status = require('./fileStatus');

exports.zipFiles = async () => {
  try {
    const files = await File.find({ status: Status.Uploaded });
    for (let i = 0; i < files.length; i++) {
      files[i].body = await compressing.zip.compressFile(files[i].body);
      files[i].status = Status.Zipped;
      await files[i].save();
    }
  } catch (err) {
    console.error('error zipping files');
  }
};
