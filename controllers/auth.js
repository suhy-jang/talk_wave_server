const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const logger = require('../utils/loggers');

const findUserById = async (id) => await User.findOne({ id });

// TODO: OAuth (Passport)
exports.signup = async (req, res) => {
  const { id, name, password } = req.body;

  if (await findUserById(id)) {
    return res.status(400).json({ errors: 'Id already exists' });
  }

  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);

  const user = new User({
    id,
    name,
    password: hashedPassword,
  });

  await user.save();

  const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
    expiresIn: '1h',
  });

  logger.info('User signed up with id: ' + user.id);
  res.status(201).json({ token, user });
};

exports.login = async (req, res) => {
  const { id, password } = req.body;

  const user = await findUserById(id);

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
    return res
      .status(400)
      .json({ isValid: false, errors: [{ msg: 'Token is required' }] });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId;

    const user = await findUserById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ isValid: false, errors: [{ msg: 'User not found' }] });
    }
    logger.info('User account verified: ' + user.id);
    // TODO: remove password from the user response
    return res.json({ isValid: true, user: user });
  } catch (error) {
    return res
      .status(400)
      .json({ isValid: false, errors: [{ msg: 'Invalid token' }] });
  }
};
