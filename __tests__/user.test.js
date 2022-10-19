/* eslint-disable no-undef */
const supertest = require('supertest');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const User = require('../models/userModel');
const { app, server } = require('../server');

// mock node-cron
const cron = require('node-cron');
const Status = require('../util/userStatus');
jest.mock('node-cron');
cron.schedule = jest.fn();

const api = supertest(app);

const initialUsers = [
  {
    name: 'rauljc',
    email: 'raul@mtz.jovenclub.cu',
    password: '123456',
  },
];

describe('authController', () => {
  beforeAll(async () => {
    await User.deleteMany({});
    for (let i = 0; i < initialUsers.length; i++) {
      const passwordHash = await bcrypt.hash(initialUsers[i].password, 12);
      const newUser = new User({
        name: initialUsers[i].name,
        email: initialUsers[i].email,
        password: passwordHash,
        createdAt: new Date().toISOString(),
        status: Status.Created,
      });

      await newUser.save();
    }
  });

  describe('signUp', () => {
    test('should return data required json', async () => {
      const response = await api
        .post('/auth/signup')
        .expect(400)
        .expect('Content-Type', /application\/json/);
      expect(response.body).toHaveProperty('general');
    });
  });

  describe('login', () => {
    test('should return json', async () => {
      await api
        .post('/auth/login')
        .send({ user: 'test', password: 'test' })
        .expect(400)
        .expect('Content-Type', /application\/json/);
    });
  });

  afterAll(async () => {
    await mongoose.connection.close();
    server.close();
  });
});
