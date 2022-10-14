// const path = require("path");
const fs = require("fs").promises;
const compressing = require("compressing");

const File = require("../models/fileModel");
const Status = require("./fileStatus");

exports.zipFiles = async () => {
  try {
    const files = await File.find({ status: Status.Uploaded });
    const zip = "./files/temp.zip";
    for (let i = 0; i < files.length; i++) {
      await compressing.zip.compressFile(files[i].body, zip, {
        relativePath: "./files",
      });
      const body = await fs.readFile(zip);
      files[i].body = Buffer.from(body);
      files[i].status = Status.Zipped;
      await files[i].save();
    }
  } catch (err) {
    console.error("error zipping files", err.message);
  }
};
