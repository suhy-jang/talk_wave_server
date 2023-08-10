const RedisStore = require('connect-redis').default;
const { createClient } = require('redis');
const logger = require('./loggers');

// Initialize client.
const redisClient = createClient();
redisClient.connect().catch(logger.error);

// Initialize store.
const redisStore = new RedisStore({
  client: redisClient,
  prefix: 'talkwave:',
});

module.exports = { redisStore };
