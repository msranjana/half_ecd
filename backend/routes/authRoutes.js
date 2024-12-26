/*const express = require('express');
const jwt = require('jsonwebtoken');

const router = express.Router();
const bcrypt = require('bcryptjs');
const db = require('../config/db');

const authController = require('../controllers/authController');

router.post('/register', (req, res) => {
    const { username, password, role, child_id } = req.body;

    // Hash the password before saving
    bcrypt.hash(password, 10, (err, hashedPassword) => {
        if (err) {
            return res.status(500).json({ message: 'Error hashing password' });
        }

        // Insert into the database
        const query = 'INSERT INTO users (username, password, role, child_id) VALUES (?, ?, ?, ?)';
        db.query(query, [username, hashedPassword, role, child_id], (err, result) => {
            if (err) {
                console.error('Error inserting user:', err);
                return res.status(500).json({ message: 'Error inserting user into database' });
            }
            res.status(201).json({ message: 'User registered successfully' });
        });
    });
});

module.exports = router;*/

const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('../config/db');  // Assuming you're using this db configuration
const router = express.Router();

// Register Route
router.post('/register', (req, res) => {
    const { username, password, role, child_id } = req.body;

    // Hash the password before saving
    bcrypt.hash(password, 10, (err, hashedPassword) => {
        if (err) {
            return res.status(500).json({ message: 'Error hashing password' });
        }

        // Insert into the database
        const query = 'INSERT INTO users (username, password, role, child_id) VALUES (?, ?, ?, ?)';
        db.query(query, [username, hashedPassword, role, child_id], (err, result) => {
            if (err) {
                console.error('Error inserting user:', err);
                return res.status(500).json({ message: 'Error inserting user into database' });
            }
            res.status(201).json({ message: 'User registered successfully' });
        });
    });
});

// Login Route
router.post('/login', (req, res) => {
    console.log('Login request received', req.body); 
    const { username, password, child_id } = req.body;

    let query = '';
    let queryParams = [];

    // Check if child_id exists, for parent login
    if (child_id) {
        query = 'SELECT * FROM users WHERE child_id = ?';
        queryParams = [child_id];
    } else if (username) {
        // Admin login based on username
        query = 'SELECT * FROM users WHERE username = ?';
        queryParams = [username];
    }

    // Ensure the query is not empty
    if (!query) {
        return res.status(400).json({ message: 'Username or Child ID required' });
    }

    db.query(query, queryParams, (err, result) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ message: 'Database error' });
        }

        if (result.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Compare password hash
        bcrypt.compare(password, result[0].password, (err, isMatch) => {
            if (err) {
                return res.status(500).json({ message: 'Error comparing passwords' });
            }

            if (!isMatch) {
                return res.status(400).json({ message: 'Invalid password' });
            }

            // Create a JWT token upon successful login
            const token = jwt.sign(
                { userId: result[0].id, role: result[0].role },
                'your_jwt_secret', // This should be an environment variable in production
                { expiresIn: '1h' }
            );

            res.json({ message: 'Login successful', token });
        });
    });
});

module.exports = router;
