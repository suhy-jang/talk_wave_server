const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

io.on('connection', (socket) => {
  console.log('User connected');

  socket.on('typing', (message) => {
    console.log('user is typing');
    socket.broadcast.emit('userTyping', message);
  });

  socket.on('stopTyping', (message) => {
    console.log('user stopped typing');
    socket.broadcast.emit('userStoppedTyping', message);
  });

  socket.on('sendMessage', (message) => {
    // console.log(`send message: ${message}`);
    io.emit('receiveMessage', message);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

server.listen(4000, () => {
  console.log('Listening on port 4000');
});
