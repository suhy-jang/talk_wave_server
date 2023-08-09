const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const dotenv = require('dotenv');
const morgan = require('morgan');
const winston = require('winston');
const rateLimit = require('express-rate-limit');
const session = require('express-session');
const RedisStore = require('connect-redis')(session);

const authRoutes = require('./routes/auth');
const socketEvents = require('./sockets/events');
const errorHandler = require('./middleware/errorHandler');

const envFile =
  process.env.NODE_ENV === 'production'
    ? './config/.env.production'
    : './config/.env.development';
dotenv.config({ path: envFile });

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: './logs/logfile.log' }),
  ],
});

const app = express();

app.use(
  session({
    store: new RedisStore({ url: process.env.REDIS_URL }),
    secret: process.env.REDIS_SECRET,
  })
);
app.use(express.json());
app.use(
  cors({
    origin: 'http://localhost:3000', // TODO: variabilization
    optionsSuccessStatus: 200,
    methods: ['GET', 'POST', 'HEAD', 'PUT', 'PATCH', 'DELETE'],
    credentials: true,
  })
);
app.use(morgan('combined'));
app.use(errorHandler);
app.use(limiter);

app.use('/auth', authRoutes);

const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

socketEvents(io);

server.listen(4000, () => {
  console.log('Listening on port 4000');
});

// 'unhandledRejection' event is emitted when a Promise is rejected but no rejection handler is attached to it.
// This is useful to detect and fix promises that are rejected silently, avoiding potential bugs and memory leaks.
process.on('unhandledRejection', (reason, _) => {
  console.error('Unhandled Rejection: ', reason);
});

// 'uncaughtException' event is emitted when an exception bubbles all the way back to the event loop.
// If not handled, it can crash the Node.js process. This event is used to perform synchronous cleanup before exiting.
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception: ', err);
  process.exit(1);
});
