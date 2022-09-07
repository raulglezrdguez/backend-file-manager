const { sign } = require('jsonwebtoken');
const User = require('../models/userModel');

exports.signUp = async (req, res) => {
  if (req && req.body) {
    const { name, email, password, confirmPassword } = req.body;

    if (name && email && password && confirmPassword) {
      const { errors, valid } = validateRegisterInput(
        nick,
        email,
        password,
        confirmPassword
      );
      if (!valid) {
        return res.status(400).send(errors);
      }

      try {
        // Confirm user does not exist
        let userDB = await User.findOne({ nick });
        if (userDB) {
          return res.status(400).send({ nick: 'Nick already exists' });
        }
        userDB = await User.findOne({ email });
        if (userDB) {
          return res.status(400).send({ email: 'email already exists' });
        }

        // Hash password and create an auth token
        const passwordHash = await bcrypt.hash(password, 12);

        let newUser = new User({
          nick,
          email,
          password: passwordHash,
          tags: [],
          search: [],
          likes: [],
          likesCount: 0,
          dislikes: [],
          dislikesCount: 0,
          status: 0,
          createdAt: new Date().toISOString(),
        });

        newUser = await newUser.save();

        const token = generateToken(newUser, '7d');

        // send email
        await transporter.sendMail({
          from: `${process.env.EMAIL_USER}`, // sender address
          to: `${newUser.email}`, // list of receivers
          subject: 'ShareTA: activate account', // Subject line
          html: `<p><b>${newUser.nick}</b>,</p><p>Please use the following token to complete the activation process:</p><br/><p>${token}</p><br/><p>Visit: <a href="${process.env.HOST}">${process.env.HOST}</a>, or use your Shareta movil app.</p><p><b>ShareTA team</b></p>`, // html body
        });

        return res.send({
          email: newUser.email,
          nick: newUser.nick,
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
