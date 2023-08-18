const mongoose = require('mongoose');
const logger = require('../utils/loggers');

const connectToDatabase = () => {
  mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  const db = mongoose.connection;

  db.on('error', (error) => {
    logger.error('MongoDB connection error: ', error);
  });

  db.once('open', () => {
    logger.info('MongoDB connected successfully.');
  });
};

module.exports = connectToDatabase;
