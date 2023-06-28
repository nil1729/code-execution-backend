const Axios = require('axios');
const { SUBMISSION_DIRECTORY, WORKER_BASE_URL, WORKER_API_TIMEOUT_MS } = require('./config/env');
const fs = require('fs');
const logger = require('./config/logger');
const path = require('path');

function saveFile(fileId, content, ext) {
  const filePath = path.resolve(SUBMISSION_DIRECTORY, `${fileId}.${ext}`);
  fs.writeFileSync(filePath, content);
  return filePath;
}

async function runCode(submission) {
  saveFile(submission.submissionId, submission.code, langExtMapper(submission.lang));
  const response = await callRunner(submission.submissionId, submission.lang);
  return response;
}

function langExtMapper(lang) {
  const map = {
    c: 'c',
    python: 'py',
  };
  return map[lang];
}

async function callRunner(submissionId, lang) {
  const apiPath = `${WORKER_BASE_URL}/run/${submissionId}/${lang}`;
  const response = await Axios.default.post(apiPath, null, {
    timeout: WORKER_API_TIMEOUT_MS,
  });
  return response.data;
}

module.exports = runCode;
