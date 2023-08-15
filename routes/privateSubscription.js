const express = require('express');
const authenticateUser = require('../middleware/authenticateUser');
const { subscribedChannels } = require('../controllers/privateSubscription');
const guardRun = require('../middleware/guardRun');

const router = express.Router();

router.get('/channels/ids', authenticateUser, guardRun(subscribedChannels));

module.exports = router;
