const cache = require('./config/cache');

class CacheUtil {
  async saveSubmission(submission) {
    await cache.setCache(submission.submissionId, submission);
  }
  async getSubmission(submissionId) {
    const data = await cache.getCache(submissionId);
    return data;
  }
}

module.exports.cacheUtil = new CacheUtil();
