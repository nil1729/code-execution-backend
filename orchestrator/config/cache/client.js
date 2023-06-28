const Redis = require('redis');
const logger = require('../logger');
const { REDIS } = require('../env');

const RedisClient = Redis.createClient({
  url: REDIS.URL,
});

RedisClient.on('error', function (err) {
  console.error(err);
  logger.error('error connection to redis instance ');
});

module.exports = RedisClient;
