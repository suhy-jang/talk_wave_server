const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const logger = require('../utils/loggers');

const users = [];

const findUserById = (id) => users.find((user) => user.id === id);

// TODO: OAuth (Passport)
exports.signup = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // Returns an array of objects containing key-value pairs such as
    // type, value, msg, path, and location
    // to detail the validation errors.
    return res.status(400).json({ errors: errors.array() });
  }

  const { id, name, password } = req.body;

  if (findUserById(id)) {
    return res.status(400).json({ errors: 'Id already exists' });
  }

  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);

  const user = {
    id,
    name,
    password: hashedPassword,
  };

  users.push(user); // should be changed

  const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
    expiresIn: '1h',
  });

  logger.info('User signed up with id: ' + user.id);
  res.status(201).json({ token, user });
};

exports.login = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { id, password } = req.body;

  const user = findUserById(id);

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ errors: 'Invalid credentials' });
  }

  const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
    expiresIn: '1h',
  });

  logger.info('User logged in with id: ' + user.id);
  res.status(200).json({ token, user });
};

exports.verify = async (req, res) => {
  const token = req.body.token;
  if (!token) {
    return res.status(400).json({ isValid: false, error: 'Token is required' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId;

    const user = findUserById(userId);
    if (!user) {
      return res.status(404).json({ isValid: false, error: 'User not found' });
    }
    logger.info('User account verified: ' + user.id);
    // TODO: remove password from the user response
    return res.json({ isValid: true, user: user });
  } catch (error) {
    return res.status(400).json({ isValid: false, error: 'Invalid token' });
  }
};
