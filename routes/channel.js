const express = require('express');
const { body } = require('express-validator');
const validateRequest = require('../middleware/validationRequest');
const authenticateUser = require('../middleware/authenticateUser');
const { channels, createChannel } = require('../controllers/channel');

const router = express.Router();

router.post(
  '/',
  authenticateUser,
  [body('name').isString(), body('requiresKey').isBoolean(), validateRequest],
  createChannel
);

router.get('/', channels);

module.exports = router;
