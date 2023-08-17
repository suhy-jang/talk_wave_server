const express = require('express');
const authenticateUser = require('../middleware/authenticateUser');
const { subscribers } = require('../controllers/privateSubscription');
const guardRun = require('../middleware/guardRun');

const router = express.Router();

router.get('/users/:channel', authenticateUser, guardRun(subscribers));

module.exports = router;
