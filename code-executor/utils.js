const cache = require('./config/cache');
const logger = require('./config/logger');

class CacheUtil {
  async updateSubmission(submissionId, status, output = null) {
    const submissionCache = await this.getSubmission(submissionId);
    if (submissionCache) {
      const updatedValue = {
        ...submissionCache,
        output: output,
        status: status,
      };
      await cache.setCache(submissionId, updatedValue);
    } else {
      logger.warn(`cache not found for submission with id ${submissionId}`);
    }
  }
  async getSubmission(submissionId) {
    const data = await cache.getCache(submissionId);
    return data;
  }
}

module.exports.cacheUtil = new CacheUtil();
