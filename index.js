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
  console.log('User connected', socket.id);

  socket.broadcast.emit('userJoined', `${socket.id} has joined the chat!`);

  socket.on('typing', (message) => {
    // console.log('user is typing');
    socket.broadcast.emit('userTyping', message);
  });

  socket.on('stopTyping', (message) => {
    // console.log('user stopped typing');
    socket.broadcast.emit('userStoppedTyping', message);
  });

  socket.on('sendMessage', (message) => {
    // console.log(`send message: ${message}`);
    io.emit('receiveMessage', message);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected', socket.id);

    socket.broadcast.emit('userLeft', `${socket.id} has left the chat!`);
  });
});

server.listen(4000, () => {
  console.log('Listening on port 4000');
});
