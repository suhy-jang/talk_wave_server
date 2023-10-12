const express = require('express');
const { body } = require('express-validator');
const validateRequest = require('../middleware/validationRequest');
const authenticateUser = require('../middleware/authenticateUser');
const {
  channels,
  createChannel,
  deleteChannel,
  verifyChannel,
} = require('../controllers/channel');
const guardRun = require('../middleware/guardRun');

const router = express.Router();

router.get('/', authenticateUser, guardRun(channels));

router.post(
  '/',
  authenticateUser,
  [body('name').isString(), body('requiresKey').isBoolean(), validateRequest],
  guardRun(createChannel)
);

router.delete('/:id', authenticateUser, guardRun(deleteChannel));

router.post(
  '/verify',
  authenticateUser,
  [body('key').isString(), body('id').isString(), validateRequest],
  guardRun(verifyChannel)
);

module.exports = router;
