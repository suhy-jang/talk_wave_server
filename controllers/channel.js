const { User, Channel } = require('../models');
const generateKey = require('../utils/generateKey');
const logger = require('../utils/loggers');

exports.channels = async (req, res) => {
  const channels = await Channel.find();
  if (!channels) {
    return res.status(404).json({ errors: [{ msg: 'Channel not found' }] });
  }
  res.status(200).json({ channels });
};

exports.createChannel = async (req, res) => {
  const { name, requiresKey } = req.body;

  let key = requiresKey ? generateKey() : null;

  const user = await User.findOne({ id: req.user.userId });
  if (!user) {
    return res.status(404).json({ errors: [{ msg: 'User not found' }] });
  }
  const channel = new Channel({
    name,
    key,
    creator: user._id,
    users: [user._id],
  });

  await channel.save();

  logger.info(
    `Channel is created with name: ${name}, key required: ${requiresKey}`
  );
  res.status(201).json({ channel });
};

exports.verifyChannel = async (req, res) => {
  const { key, id } = req.body;
  const channel = await Channel.findOne({ _id: id });
  if (!channel) {
    return res.status(404).json({ errors: [{ msg: 'Channel not found' }] });
  }
  if (channel.key === key) {
    return res.status(200).json({ isValid: true });
  } else {
    return res
      .status(400)
      .json({ isValid: false, errors: [{ msg: 'Invalid key' }] });
  }
};
