const express = require('express');
const authRoutes = require('./auth');
const channelRoutes = require('./channel');

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/channel', channelRoutes);
router.get('/', (req, res) => res.send('Fallback page'));

module.exports = router;
