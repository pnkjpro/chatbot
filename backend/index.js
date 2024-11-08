// server.js
const express = require('express');
const http = require('http');
const axios = require('axios');
const { Server } = require('socket.io');
const db = require('./config/db');

const app = express();
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:3001", "http://localhost:3002"], // Allow both apps
    methods: ["GET", "POST"]
  }
});

app.post('/messages', (req, res) => {
  const { sender_id, recipient_id, room_id, content, senderType } = req.body;
  const query = `INSERT INTO messages (sender_id, recipient_id, room_id, content, senderType) VALUES (?, ?, ?, ?, ?)`;
  db.query(query, [sender_id, recipient_id, room_id, content, senderType], (err, result) => {
    if (err) return res.status(500).send(err);
    res.status(200).send({ message: 'Message saved' });
  });
});

app.get('/messages/:roomId', (req, res) => {
  const { roomId } = req.params;
  const query = `SELECT * FROM messages WHERE room_id = ? ORDER BY timestamp`;
  db.query(query, [roomId], (err, results) => {
    if (err) return res.status(500).send(err);
    res.status(200).json(results);
  });
});

io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  // Handle incoming messages
  socket.on('message', async (data) => {
    try {
      console.log(data);
  
      await axios.post('http://localhost:3000/messages', {
        room_id: data.room,
        sender: data.sender,
        sender_id: data.sender_id,
        recipient_id: data.recipient, // Adjust according to the role or ID structure
        content: data.text,
        senderType: data.senderType,
      });
  
      // Emit message to the specific room and notify of new student if applicable
      io.to(data.room).emit('message', data);
      io.emit('newStudent', data);
  
      console.log("Sent message");
    } catch (error) {
      console.error('Error sending message:', error);
    }
  });
  

  // Join a room based on user role or ID
  socket.on('joinRoom', (room) => {
    socket.join(room);
    console.log(`User ${socket.id} joined room ${room}`);
  });

  // Leave a room
  socket.on('leaveRoom', (roomId) => {
    socket.leave(roomId);
    console.log(`User ${socket.id} left room ${roomId}`);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

server.listen(3000, () => {
  console.log('Socket.IO server is running on port 3000');
});