const express = require('express');
const { body } = require('express-validator');
const validateRequest = require('../middleware/validationRequest');
const { signup, login, verify } = require('../controllers/auth');
const guardRun = require('../middleware/guardRun');

const router = express.Router();

router.post(
  '/signup',
  [body('id'), body('password').isLength({ min: 5 }), validateRequest],
  guardRun(signup)
);

router.post(
  '/login',
  [body('id'), body('password').isLength({ min: 5 }), validateRequest],
  guardRun(login)
);

router.post('/verify', [body('token'), validateRequest], guardRun(verify));

module.exports = router;
