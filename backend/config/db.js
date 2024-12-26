
const mysql = require('mysql2');
require('dotenv').config();

// Create a connection to the database
const db = mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'msranjana',
    database: process.env.DB_NAME || 'EarlyChildDevelopmentDB',
});

// Connect to the database
db.connect((err) => {
    if (err) {
        console.error('Error connecting to the database:', err);
        process.exit(1); // Exit the process if the connection fails
    }
    console.log('Connected to the database'+ db.threadId);
});

module.exports = db;
