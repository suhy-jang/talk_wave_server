const jwt = require('jsonwebtoken');

const authenticateUser = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1]; // Assuming the format 'Bearer TOKEN'

  if (!token) {
    return res
      .status(401)
      .json({ errors: [{ msg: 'Authentication required' }] });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Allows for accessing user information in the controller later on
    next();
  } catch (error) {
    return res.status(401).json({ errors: [{ msg: 'Invalid token' }] });
  }
};

module.exports = authenticateUser;
