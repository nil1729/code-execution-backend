const { RABBIT_MQ } = require('./config/env');
const logger = require('./config/logger');
const pubsub = require('./config/pubsub');
const runCode = require('./runner');
const { cacheUtil } = require('./utils');

class SubscriberService {
  constructor() {
    this.channel = null;
  }

  async connect() {
    try {
      this.channel = await pubsub.connect(RABBIT_MQ.SUBMISSION_QUEUE);
      logger.info('subscriber service connected to queue successfully');
    } catch (error) {
      logger.error(`failed to connect subscriber service to queue`);
      console.error(error);
    }
  }

  async processSubmission() {
    await this.connect();
    this.channel.qos(RABBIT_MQ.SUBMISSION_QOS);
    this.channel.consume(RABBIT_MQ.SUBMISSION_QUEUE, this.submissionConsumer(this), {
      noAck: false,
    });
  }

  submissionConsumer(cls) {
    return async function (message) {
      const messageString = message.content.toString();
      try {
        const submission = JSON.parse(messageString);
        await cacheUtil.updateSubmission(submission.submissionId, 'processing');
        const output = await runCode(submission);
        await cacheUtil.updateSubmission(submission.submissionId, 'completed', output);
        cls.channel.ack(message);
      } catch (e) {
        console.error(e);
        logger.error(`consumer service failed to process message : [${messageString}]`);
      }
    };
  }

  async sleep() {
    logger.info(
      `consumer service sleeping for ${RABBIT_MQ.SUBMISSION_CONSUMER_SLEEP_DURATION_MS} ms`
    );
    return new Promise((resolve) =>
      setTimeout(resolve, RABBIT_MQ.SUBMISSION_CONSUMER_SLEEP_DURATION_MS)
    );
  }
}

module.exports = new SubscriberService();
