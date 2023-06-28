const { REDIS } = require('../env');
const logger = require('../logger');
const RedisClient = require('./client');

class RceCache {
  constructor() {
    this.connect();
  }

  async connect() {
    await RedisClient.connect();
    logger.info('cache client connected successfully');
  }

  /**
   *
   * @param {string} key
   * @param {object} value
   * @param {number} ttl in ms
   */
  async setCache(key, value, ttl = REDIS.TTL_MS) {
    logger.info(`saving cache with key [${key}] and TTL ${ttl} ms`);
    const ack = await RedisClient.setEx(String(key), Math.ceil(ttl / 1000), JSON.stringify(value));
    logger.info(`saved cache with key [${key}] and TTL ${ttl} ms | ack [${ack}]`);
  }

  /**
   *
   * @param {string} key
   */
  async getCache(key) {
    try {
      logger.info(`getting cache having the key [${key}]`);
      const cachedJson = await RedisClient.get(String(key));
      return JSON.parse(cachedJson);
    } catch (e) {
      return null;
    }
  }
}

module.exports = new RceCache();
