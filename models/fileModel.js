const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
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
  originalFilename: {
    type: String,
    required: [true, 'originalFileName required!'],
  },
  createdAt: {
    type: String,
    required: [true, 'CreatedAt required!'],
  },
  updatedAt: {
    type: String,
    required: [true, 'UpdatedAt required!'],
  },
});

const File = mongoose.model('File', fileSchema);

module.exports = File;
