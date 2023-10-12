const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const dotenv = require('dotenv');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const session = require('express-session');
const helmet = require('helmet');

const router = require('./routes/index');
const socketEvents = require('./sockets/events');
const errorHandlers = require('./middleware/errorHandler');
const logger = require('./utils/loggers');
const { redisStore } = require('./utils/redisConfig');
const connectToDatabase = require('./database/database');

const envPath =
  process.env.NODE_ENV === 'development'
    ? './config/.env.development'
    : './config/.env.production';
dotenv.config({ path: envPath });

connectToDatabase();

const app = express();

const corsConfig = {
  origin: process.env.CLIENT_ORIGIN,
  methods: ['GET', 'POST', 'OPTIONS', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
};

app.use(express.json());

app.use(helmet());
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", process.env.CLIENT_ORIGIN],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", process.env.CLIENT_ORIGIN],
    },
  })
);

app.use((req, res, next) => {
  res.setHeader('Permissions-Policy', 'interest-cohort=()');
  next();
});

// Initialize sesssion storage.
app.use(
  session({
    store: redisStore,
    secret: process.env.REDIS_SECRET,
    resave: false, // If true, it will save the session again even if it didn't change, like rewriting your name with a new pencil.
    saveUninitialized: false, // If true, it puts the new blank session card into the box right away. If false, it waits until something is written on it.
    cookie: {
      secure: process.env.NODE_ENV !== 'development',
      httpOnly: true,
    },
  })
);

app.use(cors(corsConfig));

app.set('trust proxy', 1);

if (process.env.NODE_ENV !== 'development') {
  app.use(morgan('combined'));

  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 500, // limit each IP to 100 requests per windowMs
    trustProxy: true, // trust 'X-Forwarded-For' header
  });

  app.use(limiter);
}

app.use('/', router);
app.use(errorHandlers.methodNotAllowed); // Handle 405
app.use(errorHandlers.routeNotFound); // Handle 404
app.use(errorHandlers.serverInternalError); // Handle 500

const server = http.createServer(app);
const io = socketIo(server, {
  cors: corsConfig,
  pingTimeout: 10000,
  pingInterval: 2500,
});

socketEvents(io);

const PORT = process.env.PORT || 4000;

server.listen(PORT, () => {
  logger.info(`Listening on port ${PORT}`);
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
