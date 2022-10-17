/* eslint-disable no-undef */
const supertest = require('supertest');
// const User = require('../models/userModel');
const { app, mongoose, server } = require('../server');
const transporter = require('../util/transporter');

const api = supertest(app);

beforeEach(async () => {
  // await User.deleteMany({})
});

test('login return json', async () => {
  await api
    .post('/auth/login')
    .expect(400)
    .expect('Content-Type', /application\/json/);
});

afterAll(async () => {
  transporter.close();
  await mongoose.connection.close();
  server.close();
});
