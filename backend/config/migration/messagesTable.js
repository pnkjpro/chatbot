//serverdb.js
const { db } = require('../serverdb.js');

const sql = `
  CREATE TABLE messages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    room_id VARCHAR(50) UNIQUE DEFAULT NOT NULL,
    student_name VARCHAR(50) DEFAULT NULL,
    student_username VARCHAR(50) DEFAULT NULL,
    examiner_name VARCHAR(50) DEFAULT NULL,
    examiner_username VARCHAR(50) DEFAULT NULL,
    content JSON,
    clientcode VARCHAR(50) DEFAULT NULL,
    session_id VARCHAR(50) DEFAULT NULL,
    session_status ENUM('active', 'inactive') DEFAULT 'active',
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
  )
`;

const createTable = async() => {
  try {
    const connection = await db.getConnection();
    await connection.query(sql);
    console.log('Table created successfully');
    connection.release();
  } catch (error) {
    console.error('Error creating table:', error);
    throw error;
  }
}

createTable();