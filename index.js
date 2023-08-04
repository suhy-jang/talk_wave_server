const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const socketEvents = require('./sockets/events');

const app = express();
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
