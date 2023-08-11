const express = require('express');
const { body } = require('express-validator');
const validateRequest = require('../middleware/validationRequest');
const authenticateUser = require('../middleware/authenticateUser');
const {
  channels,
  createChannel,
  verifyChannel,
} = require('../controllers/channel');

const router = express.Router();

router.post(
  '/',
  authenticateUser,
  [body('name').isString(), body('requiresKey').isBoolean(), validateRequest],
  createChannel
);

router.get('/', channels);

router.post(
  '/verify',
  authenticateUser,
  [body('key').isString(), body('id').isString(), validateRequest],
  verifyChannel
);

module.exports = router;
