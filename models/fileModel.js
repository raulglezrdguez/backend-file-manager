const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({
  name: {
    type: String,
    require: [true, 'Name required!'],
  },
  body: {
    type: Buffer,
    require: [true, 'Body required!'],
  },
  status: {
    type: Number,
    require: [true, 'Status required!'],
  },
  originalFileName: {
    type: String,
    require: [true, 'originalFileName required!'],
  },
});

const File = mongoose.model('File', fileSchema);

module.exports = File;
