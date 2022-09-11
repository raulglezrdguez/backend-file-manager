const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
dotenv.config({ path: '../.env' });

// // create reusable transporter object using the default SMTP transport
// const transporter = nodemailer.createTransport({
//   host: "smtp.gmail.com",
//   port: 465,
//   secure: true, // true for 465, false for other ports
//   auth: {
//     user: "shareta2022@gmail.com",
//     pass: "gvcacclkdexchsrc",
//   },
// });

// transporter
//   .verify()
//   .then(() => {
//     console.log("ready for send emails");
//   })
//   .catch((err) => console.log(err));

// module.exports = transporter;

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  // authMethod:'NTLM',
  secure: process.env.EMAIL_PORT === 465 ? true : false, // upgrade later with STARTTLS
  // tls: { rejectUnauthorized: false },
  // debug:true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

transporter
  .verify()
  .then(() => {
    console.log('ready for send emails');
  })
  .catch((err) => console.log(err));

module.exports = transporter;
