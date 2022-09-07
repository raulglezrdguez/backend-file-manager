const mongoose = require('mongoose');

const Status = { Uploaded: 'Uploaded', Zipped: 'Zipped' };

const fileSchema = new mongoose.Schema({
  name: {
    type: String,
    require: [true, 'Name required!'],
  },
  body: {
    type: String,
    require: [true, 'body required!'],
  },
  status: {
    type: Status,
    require: [true, 'Status required!'],
  },
});

const File = mongoose.Model('File', fileSchema);

module.exports = File;
