//serverdb.js
const mysql = require('mysql2/promise');
require('dotenv').config();

const db = mysql.createPool({
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: '',
  database: 'u18chatbot'  
});

// Optional: Test the connection
const testConnection = async () => {
    try {
        const connection = await db.getConnection();
        console.log('MySQL Database connected successfully');
        connection.release();
    } catch (error) {
        console.error('Error connecting to the database:', error.message);
        process.exit(1); // Exit the process with an error code
    }
};

// Test connection when the module is imported
testConnection();
module.exports = { db };