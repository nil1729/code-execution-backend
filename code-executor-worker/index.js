const express = require('express');
const app = express();
const { PORT, NODE_ENV, AVAILABLE_LANGUAGE } = require('./config/env');
const logger = require('./config/logger');
const runner = require('./runner');

app.get('', function (req, res) {
  return res.send('<h1>Code Executor Worker</h1>');
});

app.post('/run/:submissionId/:lang', async function (req, res) {
  let response = null;

  if (req.params.lang === AVAILABLE_LANGUAGE.c) {
    response = await runner.c(req.params.submissionId);
  } else if (req.params.lang === AVAILABLE_LANGUAGE.python) {
    response = await runner.python(req.params.submissionId);
  } else {
    return res.status(501).json({
      message: 'service not implemented',
    });
  }

  return res.status(200).json(response);
});

app.listen(PORT, function () {
  logger.info(`worker running in ${NODE_ENV} mode on port ${PORT}`);
});
