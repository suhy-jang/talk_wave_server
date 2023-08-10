const crypto = require('crypto');

const generateKey = () => {
  return crypto.randomBytes(16).toString('hex');
};

module.exports = generateKey;
