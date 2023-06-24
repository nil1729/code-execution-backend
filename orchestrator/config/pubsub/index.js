const amqp = require('amqplib');
const { RABBIT_MQ } = require('../env'); // amqp://hostname:5672

/**
 *
 * @param  {...string} queueNames
 * @returns channel
 */
const connect = async (...queueNames) => {
  const connection = await amqp.connect(RABBIT_MQ.URL); // open a connection
  const channel = await connection.createChannel(); // create a channel
  for (let i = 0; i < queueNames.length; i++) {
    await channel.assertQueue(queueNames[i]); // assign to multiple queue
  }
  return channel;
};

module.exports.connect = connect;
