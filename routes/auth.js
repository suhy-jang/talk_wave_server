const express = require('express');
const { body } = require('express-validator');
const { signup, login, verify } = require('../controllers/auth');
const validateRequest = require('../middleware/validationRequest');
const sanitize = require('../middleware/sanitize');
const guardRun = require('../middleware/guardRun');

const router = express.Router();

router.post(
  '/signup',
  [
    body('username').isLength({ min: 4 }),
    body('password').isLength({ min: 5 }),
    validateRequest,
    sanitize(['username', 'name', 'password']),
  ],
  guardRun(signup)
);

router.post(
  '/login',
  [
    body('username').isLength({ min: 4 }),
    body('password').isLength({ min: 5 }),
    validateRequest,
  ],
  guardRun(login)
);

router.post('/verify', [body('token'), validateRequest], guardRun(verify));

module.exports = router;
