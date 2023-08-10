const express = require('express');
const { body } = require('express-validator');
const validateRequest = require('../middleware/validationRequest');
const { signup, login, verify } = require('../controllers/auth');

const router = express.Router();

router.post(
  '/signup',
  [body('id'), body('password').isLength({ min: 5 }), validateRequest],
  signup
);

router.post(
  '/login',
  [body('id'), body('password').isLength({ min: 5 }), validateRequest],
  login
);

router.post('/verify', [body('token'), validateRequest], verify);

module.exports = router;
