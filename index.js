const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const dotenv = require('dotenv');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const session = require('express-session');
const mongoose = require('mongoose');

const router = require('./routes/index');
const socketEvents = require('./sockets/events');
const errorHandler = require('./middleware/errorHandler');
const logger = require('./utils/loggers');
const { redisStore } = require('./utils/redisConfig');

const envFile =
  process.env.NODE_ENV === 'development'
    ? './config/.env.development'
    : './config/.env.production';
dotenv.config({ path: envFile });

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});

const app = express();

// Initialize sesssion storage.
app.use(
  session({
    store: redisStore,
    secret: process.env.REDIS_SECRET,
    resave: false, // If true, it will save the session again even if it didn't change, like rewriting your name with a new pencil.
    saveUninitialized: false, // If true, it puts the new blank session card into the box right away. If false, it waits until something is written on it.
  })
);
app.use(express.json());
app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN, // TODO: variabilization
    optionsSuccessStatus: 200,
    methods: ['GET', 'POST', 'HEAD', 'PUT', 'PATCH', 'DELETE'],
    credentials: true,
  })
);
app.use(morgan('combined'));
app.use(limiter);

app.use('/', router);
app.use(errorHandler);

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
  logger.info('Listening on port 4000');
});

// 'unhandledRejection' event is emitted when a Promise is rejected but no rejection handler is attached to it.
// This is useful to detect and fix promises that are rejected silently, avoiding potential bugs and memory leaks.
process.on('unhandledRejection', (reason, _) => {
  logger.error('Unhandled Rejection: ', reason);
});

// 'uncaughtException' event is emitted when an exception bubbles all the way back to the event loop.
// If not handled, it can crash the Node.js process. This event is used to perform synchronous cleanup before exiting.
process.on('uncaughtException', (err) => {
  logger.error('Uncaught Exception: ', err);
  process.exit(1);
});
