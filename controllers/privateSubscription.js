const { PrivateSubscription } = require('../models');

exports.subscribers = async (req, res) => {
  const { channel } = req.params;
  const subscriptions = await PrivateSubscription.find({
    channel,
  })
    .select('subscriber')
    .populate({
      path: 'subscriber',
      select: '_id name',
    });

  const subscribers = subscriptions.map(
    (subscription) => subscription.subscriber
  );

  res.status(200).json({ subscribers });
};
