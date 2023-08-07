const express = require('express');
const { signup, login } = require('../controllers/authController');
const { body } = require('express-validator');

const router = express.Router();

router.post(
  '/signup',
  body('id'),
  body('password').isLength({ min: 5 }),
  signup
);

router.post('/login', body('id'), body('password').isLength({ min: 5 }), login);

module.exports = router;
