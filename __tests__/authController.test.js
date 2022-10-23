/* eslint-disable no-undef */
const supertest = require('supertest');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const { app, server } = require('../server');
const User = require('../models/userModel');
const Status = require('../util/userStatus');

const api = supertest(app);

const postData = async (endpoint, data, status = 200) => {
  return await api
    .post(endpoint)
    .send(data)
    .expect(status)
    .expect('Content-Type', /application\/json/);
};

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
    test('should return invalid data', async () => {
      const response = await postData('/auth/signup', {}, 400);
      expect(response.body).toHaveProperty('general');
      expect(response.body.general).toContain('Invalid data');
    });

    test('should return invalid name', async () => {
      const response = await postData(
        '/auth/signup',
        {
          name: 1,
          email: 'raul',
          password: 'raul',
          confirmPassword: 'raul',
        },
        400
      );
      expect(response.body).toHaveProperty('name');
      expect(response.body.name).toContain('Invalid name');
    });

    test('should return name is to short', async () => {
      const response = await postData(
        '/auth/signup',
        {
          name: 'r',
          email: 'raul',
          password: 'raul',
          confirmPassword: 'raul',
        },
        400
      );
      expect(response.body).toHaveProperty('name');
      expect(response.body.name).toContain('to short');
    });

    test('should return name is to long', async () => {
      const response = await postData(
        '/auth/signup',
        {
          name: 'raulglezrdguez1234567890',
          email: 'raul',
          password: 'raul',
          confirmPassword: 'raul',
        },
        400
      );
      expect(response.body).toHaveProperty('name');
      expect(response.body.name).toContain('to long');
    });

    test('should return invalid email', async () => {
      const response = await postData(
        '/auth/signup',
        {
          name: 'raul',
          email: 1,
          password: 'raul',
          confirmPassword: 'raul',
        },
        400
      );
      expect(response.body).toHaveProperty('email');
      expect(response.body.email).toContain('Invalid email');
    });

    test('should return incorrect email', async () => {
      const response = await postData(
        '/auth/signup',
        {
          name: 'raul',
          email: 'raul',
          password: 'raul',
          confirmPassword: 'raul',
        },
        400
      );
      expect(response.body).toHaveProperty('email');
      expect(response.body.email).toContain('Incorrect email');
    });

    test('should return invalid password', async () => {
      const response = await postData(
        '/auth/signup',
        {
          name: 'raul',
          email: 'raul@gmail.com',
          password: 1,
          confirmPassword: 'raul',
        },
        400
      );
      expect(response.body).toHaveProperty('password');
      expect(response.body.password).toContain('Invalid password');
    });

    test('should return password to short', async () => {
      const response = await postData(
        '/auth/signup',
        {
          name: 'raul',
          email: 'raul@gamil.com',
          password: '12345',
          confirmPassword: '123456',
        },
        400
      );
      expect(response.body).toHaveProperty('password');
      expect(response.body.password).toContain('to short');
    });

    test('should return invalid confirm password', async () => {
      const response = await postData(
        '/auth/signup',
        {
          name: 'raul',
          email: 'raul@gmail.com',
          password: '1234567',
          confirmPassword: 1,
        },
        400
      );
      expect(response.body).toHaveProperty('confirmPassword');
      expect(response.body.confirmPassword).toContain(
        'Invalid confirmPassword'
      );
    });

    test('should return passwords dont match', async () => {
      const response = await postData(
        '/auth/signup',
        {
          name: 'raul',
          email: 'raul@gamil.com',
          password: '1234567',
          confirmPassword: '123',
        },
        400
      );
      expect(response.body).toHaveProperty('password');
      expect(response.body).toHaveProperty('confirmPassword');
      expect(response.body.password).toContain('match');
      expect(response.body.confirmPassword).toContain('match');
    });
  });

  describe('login', () => {
    test('should return json', async () => {
      postData('/auth/login', { user: 'test', password: 'test' }, 400);
    });
  });

  afterAll(async () => {
    await mongoose.connection.close();
    server.close();
  });
});
