//serverdb.js
const { db } = require('./serverdb.js');

const sql = `
  CREATE TABLE messages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    room_id VARCHAR(50) DEFAULT NULL,
    student_name VARCHAR(50) DEFAULT NULL,
    student_username VARCHAR(50) DEFAULT NULL,
    examiner_name VARCHAR(50) DEFAULT NULL,
    examiner_username VARCHAR(50) DEFAULT NULL,
    content JSON DEFAULT NULL,
    clientcode VARCHAR(50) DEFAULT NULL,
    session_id VARCHAR(50) DEFAULT NULL,
    session_status ENUM('active', 'inactive') NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
  )
`;

db.query(sql, (err, result) => {
  if (err) {
    console.error('Error creating table:', err);
    throw err;
  }
  console.log('Table created');
});