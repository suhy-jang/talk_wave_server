const express = require('express');
const { param } = require('express-validator');
const validateRequest = require('../middleware/validationRequest');
const { getMessagesByChannel } = require('../controllers/message');
const guardRun = require('../middleware/guardRun');

const router = express.Router();

router.get(
  '/:channelId',
  [param('channelId').isString(), validateRequest],
  guardRun(getMessagesByChannel)
);

module.exports = router;
