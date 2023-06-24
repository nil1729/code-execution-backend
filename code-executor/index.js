const express = require('express');
const app = express();
const { PORT, NODE_ENV } = require('./config/env');
const logger = require('./config/logger');
const subscriber = require('./subscriber-service');

app.get('', function (req, res) {
  return res.send('<h1>Code Executor Service</h1>');
});

app.listen(PORT, function () {
  logger.info(`executor service running in ${NODE_ENV} mode on port ${PORT}`);
  subscriber.processSubmission();
});
