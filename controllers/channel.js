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
