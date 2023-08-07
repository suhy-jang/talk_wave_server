const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');

const users = [];

const findUserById = (id) => users.find((user) => user.id === id);

exports.signup = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { id, password } = req.body;

  if (findUserById(id)) {
    return res.status(400).json({ errors: 'Id already exists' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = {
    id,
    password: hashedPassword,
  };

  users.push(user); // should be changed

  req.status(201).json({ userId: user.id });
};

exports.login = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { id, password } = req.body;

  const user = findUserById(id);

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ errors: 'Invalid credentials' });
  }

  // TODO: secret key setting

  const token = jwt.sign({ userId: user.id }, 'secret_key', {
    expiresIn: '1h',
  });

  res.status(200).json({ token });
};
