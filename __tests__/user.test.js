/* eslint-disable no-undef */
const supertest = require('supertest');
const mongoose = require('mongoose');
const User = require('../models/userModel');
const { app, server } = require('../server');

// mock node-cron
const cron = require('node-cron');
jest.mock('node-cron');
cron.schedule = jest.fn();

const api = supertest(app);

describe('authController', () => {
  beforeAll(async () => {
    await User.deleteMany({});
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
