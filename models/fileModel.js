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
});

const File = mongoose.Model('File', fileSchema);

module.exports = File;
