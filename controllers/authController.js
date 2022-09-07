const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/userModel');
const transporter = require('../util/transporter');
const Status = require('../util/userStatus');
const { validateSignUpInput } = require('../util/validators');

function generateToken(user, expiresIn) {
  return jwt.sign(
    {
      id: user._id,
      name: user.name,
      email: user.email,
    },
    process.env.SECRET_KEY,
    { expiresIn }
  );
}

exports.signUp = async (req, res) => {
  if (req && req.body) {
    const { name, email, password, confirmPassword } = req.body;

    if (name && email && password && confirmPassword) {
      const { errors, valid } = validateSignUpInput(
        name,
        email,
        password,
        confirmPassword
      );
      if (!valid) {
        return res.status(400).send(errors);
      }

      try {
        // Confirm user does not exist
        let userDB = await User.findOne({ name });
        if (userDB) {
          return res.status(400).send({ name: 'Name already exists' });
        }
        userDB = await User.findOne({ email });
        if (userDB) {
          return res.status(400).send({ email: 'email already exists' });
        }

        // Hash password and create an auth token
        const passwordHash = await bcrypt.hash(password, 12);

        let newUser = new User({
          name,
          email,
          password: passwordHash,
          createdAt: new Date().toISOString(),
          status: Status.Created,
        });

        newUser = await newUser.save();

        const token = generateToken(newUser, '7d');

        // send email
        await transporter.sendMail({
          from: `${process.env.EMAIL_USER}`, // sender address
          to: `${newUser.email}`, // list of receivers
          subject: 'FileManager: activate account', // Subject line
          html: `<p><b>${newUser.name}</b>,</p><p>Please use the following token to complete the activation process:</p><br/><p>${token}</p><br/><p>Visit: <a href="${process.env.HOST}">${process.env.HOST}</a>, or use your FileManager movil app.</p><p><b>FileManager team</b></p>`, // html body
        });

        return res.send({
          email: newUser.email,
          name: newUser.name,
        });
      } catch (err) {
        return res.status(500).send({ general: 'Internal server error' });
      }
    } else {
      return res.status(400).send({ general: 'Invalid data' });
    }
  } else {
    return res.status(400).send({ general: 'Invalid data' });
  }
};

exports.activate = async (req, res) => {
  if (req && req.body) {
    const { token, name, email, password, confirmPassword } = req.body;

    if (token && name && email && password && confirmPassword) {
      const { errors, valid } = validateSignUpInput(
        name,
        email,
        password,
        confirmPassword
      );
      if (!valid) {
        return res.status(400).send(errors);
      }

      if (!token) {
        return res.status(400).send({ token: 'token expected' });
      }

      let userTk;
      jwt.verify(token, process.env.SECRET_KEY, (err, decodedToken) => {
        userTk = decodedToken;
      });

      if (!userTk || !userTk.name || !userTk.email) {
        return res.status(400).send({ token: 'Invalid token' });
      }

      try {
        // Confirm user exist
        if (userTk.name !== name) {
          return res.status(400).send({ name: 'Name does not match' });
        }
        if (userTk.email !== email) {
          return res.status(400).send({ email: 'email does not match' });
        }

        const userDB = await User.findOne({ email });
        if (!userDB) {
          return res.status(404).send({ email: 'email does not exists' });
        }

        const match = await bcrypt.compare(password, userDB.password);
        if (!match) {
          return res.status(400).send({ password: 'Incorrect password' });
        }

        if (userDB.status === 0) userDB.status = 1;
        await userDB.save();

        const token = generateToken(userDB, '7d');

        return res.send({
          id: userDB._id,
          createdAt: userDB.createdAt,
          dislikes: userDB.dislikes,
          dislikesCount: userDB.dislikesCount,
          email: userDB.email,
          likes: userDB.likes,
          likesCount: userDB.likesCount,
          nick: userDB.nick,
          search: userDB.search,
          status: userDB.status,
          tags: userDB.tags,
          token,
        });
      } catch (err) {
        return res.status(500).send({ general: 'Internal server error' });
      }
    } else {
      return res.status(400).send({ general: 'Invalid data' });
    }
  } else {
    return res.status(400).send({ general: 'Invalid data' });
  }
};
