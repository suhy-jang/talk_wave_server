const express = require('express');
const authRoutes = require('./auth');
const channelRoutes = require('./channel');

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/channel', channelRoutes);

module.exports = router;
