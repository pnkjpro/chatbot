// server.js
const express = require('express');
const http = require('http');
const axios = require('axios');
const { Server } = require('socket.io');
const cors = require('cors'); // Import the cors package
const db = require('./config/serverdb');

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
    origin: ["http://localhost:3001", "http://localhost:3002"],
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
  const {
    sender,
    sender_id,
    recipient_id,
    room_id,
    message,
    examination_id,
    senderType,
    timestamp,
  } = req.body;

  // Check if the room_id exists
  const selectQuery = `SELECT content FROM messages WHERE room_id = ? LIMIT 1`;
  db.query(selectQuery, [room_id], (err, results) => {
    if (err) {
      return res.status(500).send({ error: 'Database query failed', details: err });
    }

    let conversation = [];
    if (results.length > 0) {
      try {
        if (results[0].content) {
          conversation = JSON.parse(results[0].content);
        }
      } catch (err) {
        return res.status(500).send({ error: 'Invalid JSON in content field', details: err });
      }

      // Add the new message to the conversation
      conversation.push({
        sender,
        sender_id,
        recipient_id,
        message,
        senderType,
        timestamp: timestamp || new Date().toISOString(),
      });

      // Determine the columns based on senderType
      const isStudent = senderType === "student";
      const nameColumn = isStudent ? "student_name" : "examiner_name";
      const usernameColumn = isStudent ? "student_username" : "examiner_username";

      // Update the record if it exists
      const updateQuery = `
        UPDATE messages 
        SET 
          content = ?, 
          ${nameColumn} = COALESCE(${nameColumn}, ?), 
          ${usernameColumn} = COALESCE(${usernameColumn}, ?)
        WHERE room_id = ?
      `;

      db.query(
        updateQuery,
        [JSON.stringify(conversation), sender, sender_id, room_id],
        (err, result) => {
          if (err) {
            return res.status(500).send({ error: 'Database update failed', details: err });
          }
          res.status(200).send({ message: 'Message updated' });
        }
      );
    } else {
      // Create a new record if room_id does not exist
      const isStudent = senderType === "student";
      const nameColumn = isStudent ? "student_name" : "examiner_name";
      const usernameColumn = isStudent ? "student_username" : "examiner_username";

      conversation.push({
        sender,
        sender_id,
        recipient_id,
        message,
        senderType,
        timestamp: timestamp || new Date().toISOString(),
      });

      const insertQuery = `
        INSERT INTO messages (room_id, ${nameColumn}, ${usernameColumn}, content, session_id)
        VALUES (?, ?, ?, ?, ?)
      `;

      db.query(
        insertQuery,
        [room_id, sender, sender_id, JSON.stringify(conversation), examination_id],
        (err, result) => {
          if (err) {
            return res.status(500).send({ error: 'Database insertion failed', details: err });
          }
          res.status(201).send({ message: 'Message inserted' });
        }
      );
    }
  });
});

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
  const query = `SELECT room_id, student_name, student_username, content, session_id FROM messages`;


  db.query(query, (err, results) => {
    if (err) return res.status(500).send(err);
    res.status(200).json(results);
  });
});

app.get('/terminateSession/:sessionId', (req, res) => {
  const { sessionId } = req.params;
  const query = `UPDATE INTO messages SET session_status = ? WHERE session_id = ?`
  db.query(query, ['terminated', sessionId], (err, results) => {
    if (err) return res.status(500).send(err);
    res.status(200).json(results);
  });
});

const connectedStudents = new Map();

io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  // Track user on connection
  socket.on('userConnected', (examinationId) => {
    connectedStudents.set(examinationId, socket.id)
    io.emit('userStatus', { examinationId, status: 'online' });
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
        examination_id: data.examination_id, 
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
  socket.on('joinRoom', (roomId) => {
    socket.join(roomId);
    console.log(`User ${socket.id} joined room ${roomId}`);
  });

  // Leave a room
  socket.on('leaveRoom', (roomId) => {
    socket.leave(roomId);
    console.log(`User ${socket.id} left room ${roomId}`);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);

    let disconnectedexaminationId = null; // Define a variable to hold the studentId

    for (const [examinationId, id] of connectedStudents.entries()) {
      if (id === socket.id) {
        connectedStudents.delete(examinationId);
        disconnectedexaminationId = examinationId; // Store the studentId
        console.log(`User ${examinationId} is offline`);
        break; // Exit the loop once the student is found
      }
    }

    // Check if a studentId was found and emit the event if so
    if (disconnectedexaminationId !== null) {
      io.emit('userStatus', { examinationId: disconnectedexaminationId, status: 'offline' });
    }
  });

});

server.listen(3008, '0.0.0.0', () => {
  console.log('Socket.IO server is running on port 3008');
});