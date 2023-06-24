const { RABBIT_MQ } = require('./config/env');
const logger = require('./config/logger');
const pubsub = require('./config/pubsub');

class PublisherService {
  constructor() {
    this.channel = null;
    this.connect();
  }

  async connect() {
    try {
      this.channel = await pubsub.connect(RABBIT_MQ.SUBMISSION_QUEUE, RABBIT_MQ.RESULTS_QUEUE);
      logger.info('publisher service connected to queue successfully');
    } catch (error) {
      logger.error(`failed to connect publisher service to queue`);
      console.error(error);
    }
  }

  async checkConnection(queueName) {
    try {
      const response = await this.channel.checkQueue(queueName);
      return queueName === response.queue;
    } catch (e) {
      throw new Error('publisher service disconnected from queue');
    }
  }

  async publishSubmission(submission, retryCount = RABBIT_MQ.MAX_RETRY) {
    if (retryCount > RABBIT_MQ.MAX_RETRY) {
      logger.error(
        `maximum retry exceeded for publishing submission: [${submission.submissionId}]`
      );
      return;
    }

    if (await this.checkConnection(RABBIT_MQ.SUBMISSION_QUEUE)) {
      const ack = this.channel.sendToQueue(
        RABBIT_MQ.SUBMISSION_QUEUE,
        Buffer.from(JSON.stringify(submission))
      );

      if (!ack) {
        return this.publishSubmission(submission, retryCount + 1);
      }
    }
  }
}

module.exports = new PublisherService();
