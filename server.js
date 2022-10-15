const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cron = require('node-cron');

require('dotenv').config();

const expressMidleware = require('./util/expressMiddleware');
const { zipFiles } = require('./util/zipFile');

// let mongoUrl = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0.2xsawxs.mongodb.net/?retryWrites=true&w=majority`;
let mongoUrl = `mongodb://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@ac-z7qx0rf-shard-00-00.2xsawxs.mongodb.net:27017,ac-z7qx0rf-shard-00-01.2xsawxs.mongodb.net:27017,ac-z7qx0rf-shard-00-02.2xsawxs.mongodb.net:27017/?ssl=true&replicaSet=atlas-bbfw2s-shard-0&authSource=admin&retryWrites=true&w=majority`;
if (process.env.MONGO_USER === '') {
  const db =
    process.env.NODE_ENV === 'test'
      ? process.env.MONGO_DATABASE_TEST
      : process.env.MONGO_DATABASE;
  mongoUrl = `mongodb://${process.env.MONGO_IP}:${process.env.MONGO_PORT}/${db}`;
}

const authRouter = require('./routes/userRoutes');
const fileRouter = require('./routes/fileRoutes');

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
  res.send('<h2>Hello backend users</h2>');
});

app.use('/auth', authRouter);
app.use('/file', fileRouter);

app.use((req, res) => {
  res.status(404).json({
    error: 'Not found',
  });
});

cron.schedule('*/1 * * * *', () => {
  zipFiles();
});

const port = process.env.PORT || 4000;

app.listen(port, () => console.log(`backend ready on port: ${port}`));
