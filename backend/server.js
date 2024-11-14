// server.js
const express = require('express');
const http = require('http');
const axios = require('axios');
const { Server } = require('socket.io');
const cors = require('cors'); // Import the cors package
const db = require('./config/serverdb.js');

const app = express();
app.use(express.json());

// Apply CORS middleware globally
app.use(cors({
  origin: ["http://localhost:3001", "http://localhost:3002", "https://localhost"], // Allow requests from these origins
  methods: ["GET", "POST"], // Allowed methods
  allowedHeaders: ["Content-Type", "Authorization"], // Add necessary headers
  credentials: true // Set to true if you need to send cookies or authentication data
}));

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:3001", "http://localhost:3002", "https://localhost"],
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,  // Add this
  },
  transports: ['websocket', 'polling'],  // Add this
  pingTimeout: 60000,   // Add this
  pingInterval: 25000   // Add this
});

app.get('/check', (req, res) => {
console.log("node script is running successfully!");
return res.status(200).send({message: 'node script is running successfully!'});
})

app.post('/messages', (req, res) => {
  const { sender, sender_id, recipient_id, room_id, message, senderType, timestamp } = req.body;

  const selectQuery = `SELECT content FROM messages WHERE room_id = ? LIMIT 1`;
  db.query(selectQuery, [room_id], (err, results) => {
    if (err) return res.status(500).send({ error: 'Database query failed', details: err });

    let conversation = [];
    if (results.length > 0 && results[0].content){
      conversation = JSON.parse(results[0].content);
    }

    conversation.push({
      sender,
      sender_id,
      recipient_id,
      message,
      senderType,
      timestamp,
    })

    //convert updated conversation to JSON and upsert it back into the database
    if(senderType === "student"){ //to update student_name
      const upsertQuery = `
    INSERT INTO messages (room_id, student_name, student_username, content)
    VALUES (?, ?, ?, ?)
    ON DUPLICATE KEY UPDATE
        content = VALUES(content),
        student_name = COALESCE(student_name, VALUES(student_name)),
        student_username = COALESCE(student_username, VALUES(student_username))
    `;

    db.query(upsertQuery, [room_id, sender, sender_id, JSON.stringify(conversation)], (err, result) => {
      if (err) return res.status(500).send({ error: 'Database update failed', details: err });
      res.status(200).send({ message: 'Message saved' });
    });
    } else {
      const upsertQuery = `
    INSERT INTO messages (room_id, examiner_name, examiner_username, content)
    VALUES (?, ?, ?, ?)
    ON DUPLICATE KEY UPDATE
        content = VALUES(content),
        examiner_name = COALESCE(examiner_name, VALUES(examiner_name)),
        examiner_username = COALESCE(examiner_username, VALUES(examiner_username))
    `;

    db.query(upsertQuery, [room_id, sender, sender_id, JSON.stringify(conversation)], (err, result) => {
      if (err) return res.status(500).send({ error: 'Database update failed', details: err });
      res.status(200).send({ message: 'Message saved' });
    });
    }


  });
})

// Define a route to retrieve messages for a specific room
app.get('/messages/:roomId', (req, res) => {
  const { roomId } = req.params;
  const query = `SELECT * FROM messages WHERE room_id = ?`;
  db.query(query, [roomId], (err, results) => {
    if (err) {
      return res.status(500).send({ error: 'Database query failed', details: err });
    }
    res.status(200).json(results);
  });
});

app.get('/students', (req, res) => {
  const query = `SELECT room_id, student_name, content FROM messages`;


  db.query(query, (err, results) => {
    if (err) return res.status(500).send(err);
    res.status(200).json(results);
  });
});

const connectedStudents = new Map();

io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  // Track user on connection
  socket.on('userConnected', (studentId) => {
    connectedStudents.set(studentId, socket.id)
    io.emit('userStatus', { studentId, status: 'online' });
  });

  //Handle incoming messages
  socket.on('message', async (data) => {
    try {
      console.log(data);

      await axios.post('http://localhost:3008/messages', {
        room_id: data.room_id,
        sender: data.sender,
        sender_id: data.sender_id,
        recipient_id: data.recipient_id, // Adjust according to the role or ID structure
        message: data.message,
        senderType: data.senderType,
        timestamp: data.timestamp,
      });

      // Emit message to the specific room and notify of new student if applicable
      io.to(data.room_id).emit('message', data);
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

    let disconnectedStudentId = null; // Define a variable to hold the studentId

    for (const [studentId, id] of connectedStudents.entries()) {
      if (id === socket.id) {
        connectedStudents.delete(studentId);
        disconnectedStudentId = studentId; // Store the studentId
        console.log(`User ${studentId} is offline`);
        break; // Exit the loop once the student is found
      }
    }

    // Check if a studentId was found and emit the event if so
    if (disconnectedStudentId !== null) {
      io.emit('userStatus', { studentId: disconnectedStudentId, status: 'offline' });
    }
  });

});

server.listen(3008, '0.0.0.0', () => {
  console.log('Socket.IO server is running on port 3008');
});