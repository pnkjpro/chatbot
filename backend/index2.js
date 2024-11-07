

const io = require('socket.io')(3000, {
    cors: {
      origin: "*", // Adjust for security in production
    }
  });
  
  io.on('connection', (socket) => {
    console.log('New client connected:', socket.id);
  
    socket.on('message', (data) => {
      // Broadcast the message to the examiner
      console.log(data);
      io.emit('receiveMessage', data);
    });
  
    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
    });
  });
  