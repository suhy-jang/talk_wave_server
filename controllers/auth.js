const bcrypt = require('bcrypt');
const User = require('../models/user');
const logger = require('../utils/loggers');
const { generateToken, verifyToken } = require('../utils/jwt');

// TODO: OAuth (Passport)
exports.signup = async (req, res) => {
  const { username, name, password } = req.body;

  if (await User.findOne({ username })) {
    return res.status(400).json({ errors: 'Id already exists' });
  }

  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);

  const user = new User({
    username,
    name,
    password: hashedPassword,
  });

  await user.save();

  const token = generateToken(user._id);

  const { password: _, ...userWithoutPassword } = user.toObject();

  logger.info('User signed up with id: ' + userWithoutPassword._id);
  res.status(201).json({ token, user: userWithoutPassword });
};

exports.login = async (req, res) => {
  const { username, password } = req.body;

  const user = await User.findOne({ username });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ errors: 'Invalid credentials' });
  }

  const token = generateToken(user._id);

  const { password: _, ...userWithoutPassword } = user.toObject();

  logger.info('User logged in with id: ' + userWithoutPassword._id);
  res.status(200).json({ token, user: userWithoutPassword });
};

exports.verify = async (req, res) => {
  const token = req.body.token;
  if (!token) {
    return res
      .status(400)
      .json({ isValid: false, errors: [{ msg: 'Token is required' }] });
  }

  try {
    const decoded = verifyToken(token);
    const userId = decoded.userId;

    const user = await User.findOne({ _id: userId });
    if (!user) {
      return res
        .status(404)
        .json({ isValid: false, errors: [{ msg: 'User not found' }] });
    }

    const { password: _, ...userWithoutPassword } = user.toObject();

    logger.info('User account verified: ' + userWithoutPassword._id);
    return res.json({ isValid: true, user: userWithoutPassword });
  } catch (error) {
    return res
      .status(400)
      .json({ isValid: false, errors: [{ msg: 'Invalid token' }] });
  }
};
