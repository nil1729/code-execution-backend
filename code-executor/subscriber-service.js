const { RABBIT_MQ } = require('./config/env');
const logger = require('./config/logger');
const pubsub = require('./config/pubsub');
const runCode = require('./runner');

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
        await runCode(submission);
        cls.channel.ack(message);
      } catch (e) {
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
