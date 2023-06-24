module.exports = {
  DEV_ENV: 'development',
  PORT: process.env.CODE_EXECUTOR_PORT,
  NODE_ENV: process.env.NODE_ENV,
  RABBIT_MQ: {
    URL: process.env.RABBIT_MQ_URL,
    SUBMISSION_QUEUE: process.env.SUBMISSION_QUEUE,
    RESULTS_QUEUE: process.env.RESULTS_QUEUE,
    MAX_RETRY: Number(process.env.PUBLISH_MAX_RETRY),
    SUBMISSION_QOS: Number(process.env.SUBMISSION_QOS),
    SUBMISSION_CONSUMER_SLEEP_DURATION_MS: Number(
      process.env.SUBMISSION_CONSUMER_SLEEP_DURATION_MS
    ),
  },
  SUBMISSION_DIRECTORY: process.env.SUBMISSION_DIRECTORY,
  WORKER_BASE_URL: process.env.WORKER_BASE_URL,
  WORKER_API_TIMEOUT_MS: Number(process.env.WORKER_API_TIMEOUT_MS),
};
