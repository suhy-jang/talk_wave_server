const { User, Channel, PrivateSubscription } = require('../models');
const generateKey = require('../utils/generateKey');
const logger = require('../utils/loggers');
const { REQUIRED_SUBSCRIPTION } = require('../utils/constants');

exports.channels = async (req, res) => {
  const subscribedChannels = await PrivateSubscription.find({
    subscriber: req.user.userId,
  }).select('channel');
  const subscribedChannelIds = subscribedChannels.map((sub) =>
    sub.channel._id.toString()
  );
  const filteredChannels = await Channel.find();
  const requiredSubscriptionKey = REQUIRED_SUBSCRIPTION;
  filteredChannels.forEach((channel) => {
    if (channel.key && !subscribedChannelIds.includes(channel._id.toString())) {
      channel.key = requiredSubscriptionKey;
    }
  });

  res.status(200).json({ channels: filteredChannels });
};

exports.createChannel = async (req, res) => {
  const { name, requiresKey } = req.body;

  const userId = req.user.userId;
  let key = requiresKey ? generateKey() : null;

  const channel = new Channel({
    name,
    key,
    creator: userId,
  });

  const privateSubscription = new PrivateSubscription({
    subscriber: userId,
    channel: channel._id,
  });

  await channel.save();
  await privateSubscription.save();

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
  const user = await User.findOne({ _id: req.user.userId });
  if (channel.key === key) {
    const privateSubscription = new PrivateSubscription({
      subscriber: user._id,
      channel: channel._id,
    });

    await privateSubscription.save();
    return res.status(200).json({ isValid: true, channel });
  } else {
    return res
      .status(400)
      .json({ isValid: false, errors: [{ msg: 'Invalid key' }] });
  }
};
