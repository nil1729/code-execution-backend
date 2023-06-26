const express = require('express');
const app = express();
const { PORT, NODE_ENV } = require('./config/env');
const logger = require('./config/logger');
const publisher = require('./publisher-service');
const cors = require('cors');

app.use(express.json());
app.use(cors());

app.get('', function (req, res) {
  return res.send('<h1>Code Execution Engine</h1>');
});

app.post('/submit', async function (req, res) {
  logger.info(`submission: ${req.body.code}`);
  const submission = {
    submissionId: new Date().getTime(),
    code: req.body.code,
    lang: req.body.lang,
  };
  publisher.publishSubmission(submission);
  return res.status(200).json({
    message: 'code submission successfull',
  });
});

app.listen(PORT, function () {
  logger.info(`orchestrator running in ${NODE_ENV} mode on port ${PORT}`);
});
