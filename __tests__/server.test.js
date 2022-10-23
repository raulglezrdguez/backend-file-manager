/* eslint-disable no-undef */
const mongoose = require('mongoose');
const cron = require('node-cron');

const { server } = require('../server');

test('should start node-cron schedule', () => {
  //   expect(cron.schedule).toBeCalled();
  expect(cron.schedule).toBeCalledTimes(1);
  //   expect(cron.schedule).toBeCalledWith('*/1 * * * *', () => {});
});

afterAll(async () => {
  await mongoose.connection.close();
  server.close();
});
