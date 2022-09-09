const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: [true, 'Owner required!'],
  },
  name: {
    type: String,
    required: [true, 'Name required!'],
  },
  body: {
    type: Buffer,
    required: [true, 'Body required!'],
  },
  status: {
    type: Number,
    required: [true, 'Status required!'],
  },
  originalFileName: {
    type: String,
    required: [true, 'originalFileName required!'],
  },
});

const File = mongoose.model('File', fileSchema);

module.exports = File;
