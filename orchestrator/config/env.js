module.exports = {
  DEV_ENV: 'development',
  PORT: process.env.ORCHESTRATOR_PORT,
  NODE_ENV: process.env.NODE_ENV,
  RABBIT_MQ: {
    URL: process.env.RABBIT_MQ_URL,
    SUBMISSION_QUEUE: process.env.SUBMISSION_QUEUE,
    RESULTS_QUEUE: process.env.RESULTS_QUEUE,
    MAX_RETRY: process.env.PUBLISH_MAX_RETRY,
  },
};
