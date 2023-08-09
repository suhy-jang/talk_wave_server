const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('./routes/auth');
const socketEvents = require('./sockets/events');

const envFile =
  process.env.NODE_ENV === 'production'
    ? './config/.env.production'
    : './config/.env.development';
dotenv.config({ path: envFile });

const app = express();

app.use(express.json());
app.use(
  cors({
    origin: 'http://localhost:3000',
    optionsSuccessStatus: 200,
    methods: ['GET', 'POST', 'HEAD', 'PUT', 'PATCH', 'DELETE'],
    credentials: true,
  })
);

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
