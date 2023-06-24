const childProcess = require('child_process');
const path = require('path');
const fs = require('fs');
const { SUBMISSION_DIRECTORY } = require('../config/env');
const logger = require('../config/logger');

async function process(id) {
  const response = {
    compiled: false,
    success: false,
    output: null,
    error: null,
  };

  const filePath = path.resolve(SUBMISSION_DIRECTORY, `${id}.c`);
  const compilerResult = await compile(filePath, id);

  if (!compilerResult.compiled) {
    response.error = compilerResult.error;
    return response;
  }

  response.compiled = true;
  const runnerResult = await run(compilerResult.output);
  response.success = runnerResult.success;
  response.error = runnerResult.error;
  response.output = runnerResult.output;

  return response;
}

async function compile(filePath, id) {
  const runnerFile = path.resolve(SUBMISSION_DIRECTORY, `run_${id}`);
  const compiler = childProcess.spawn('gcc', [filePath, '-o', runnerFile]);
  const result = { compiled: true, error: null, output: null };

  return new Promise(function (resolve, reject) {
    compiler.stderr.on('data', async (data) => {
      try {
        const errorOutput = await data.toString();
        result.compiled = false;
        result.error = errorOutput;
        result.output = null;
      } catch (error) {
        logger.error(`internal compilation error: [${id}]`);
        console.error(error);
      }
      resolve(result);
    });

    compiler.on('close', (code) => {
      if (code === 0) {
        result.output = runnerFile;
        resolve(result);
      }
    });
  });
}

async function run(filePath) {
  const runner = childProcess.spawn(filePath);
  const result = { success: true, error: null, output: null };

  return new Promise(function (resolve, reject) {
    runner.stdout.on('data', async (data) => {
      try {
        const output = await data.toString();
        result.output = output;
        resolve(result);
      } catch (error) {
        logger.error(`internal runner error: [${id}]`);
        console.error(error);
      }
    });

    runner.stderr.on('data', async (data) => {
      try {
        const errorOutput = await data.toString();
        result.error = errorOutput;
        result.success = false;
        resolve(result);
      } catch (error) {
        logger.error(`internal runner error: [${id}]`);
        console.error(error);
      }
    });
  });
}

module.exports = process;
