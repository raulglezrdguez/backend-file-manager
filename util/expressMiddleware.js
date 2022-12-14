const dotenv = require('dotenv');
dotenv.config({ path: '../.env' });

const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  let token = null;
  if (req && req.headers && req.headers.authorization) {
    token = req.headers.authorization.split('Bearer ')[1];
  }

  if (token) {
    jwt.verify(token, process.env.SECRET_KEY, (err, decodedToken) => {
      if (err) {
        console.log(err.message);
      }
      req.user = decodedToken;
    });
  } else {
    req.user = null;
  }

  next();
};
