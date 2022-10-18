/* eslint-disable no-undef */
const supertest = require('supertest');
const mongoose = require('mongoose');
// const User = require('../models/userModel');
const { app, server } = require('../server');

// const nodemailer = require('nodemailer');

// const sendMailMock = jest.fn();
// const verifyMock = jest.fn().mockReturnValue({});

// jest.mock('nodemailer');
// nodemailer.createTransport.mockReturnValue({
//   sendMail: sendMailMock,
//   verify: verifyMock,
// });

const api = supertest(app);

beforeEach(async () => {
  // await User.deleteMany({})
  // sendMailMock.mockClear();
  // nodemailer.createTransport.mockClear();
});

test('login return json', async () => {
  await api
    .post('/auth/login')
    .send({ user: 'test', password: 'test' })
    .expect(400)
    .expect('Content-Type', /application\/json/);
});

afterAll(async () => {
  await mongoose.connection.close();
  server.close();
});
