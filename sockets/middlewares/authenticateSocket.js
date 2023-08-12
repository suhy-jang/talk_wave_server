const { verifyToken } = require('../../utils/jwt');

const authenticateSocket = (socket, next) => {
  const token = socket.handshake.query.token;

  if (!token) {
    return next(new Error('Authentication required'));
  }

  const decoded = verifyToken(token);
  if (!decoded) {
    return next(new Error('Invalid token'));
  }

  socket.user = decoded;
  next();
};

module.exports = authenticateSocket;
