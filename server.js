const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

require('dotenv').config();

const expressMidleware = require('./util/expressMiddleware');

let mongoUrl = `mongodb://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_IP}:${process.env.MONGO_PORT}/${process.env.MONGO_DATABASE}`;
if (process.env.MONGO_USER === '') {
  mongoUrl = `mongodb://${process.env.MONGO_IP}:${process.env.MONGO_PORT}/${process.env.MONGO_DATABASE}`;
}

const authRouter = require('./routes/userRoutes');

const app = express();

app.use(express.json());
app.use(cors());

const connetWithRetry = () => {
  mongoose
    .connect(mongoUrl, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => console.log('Connected to database'))
    .catch((e) => {
      console.log(e);
      setTimeout(connetWithRetry, 5000);
    });
};

connetWithRetry();

app.use(expressMidleware);

app.get('/', (req, res) => {
  res.send('<h2>Hello</h2>');
});

app.use('/auth', authRouter);

const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`backend ready on port: ${port}`));
