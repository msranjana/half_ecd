const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../config/db'); // Assuming your DB connection is set up here
require('dotenv').config();  // Make sure you're loading the environment variables

// Register a new user (parent or admin)
exports.register = (req, res) => {
    const { username, password, role, child_id } = req.body;

    if (!username || !password || !role) {
        return res.status(400).json({ error: 'Username, password, and role are required' });
    }

    const hashPassword = bcrypt.hashSync(password, 10);

    // SQL query to insert new user
    let sql = `INSERT INTO users (username, password, role, child_id) VALUES (?, ?, ?, ?)`;

    db.query(sql, [username, hashPassword, role, child_id || null], (err, result) => {
        if (err) {
            console.error("Error during registration:", err);
            return res.status(500).json({ error: 'Database error: ' + err.message });
        }

        res.status(201).json({ message: 'User registered successfully!' });
    });
};

// Login user (parent or admin)
exports.login = (req, res) => {
    const { username, password, child_id } = req.body;

    if (!username || !password) {
        return res.status(400).json({ error: 'Username and password are required' });
    }

    // Query based on child_id (for parent) or username (for admin)
    let sql = child_id
        ? `SELECT * FROM users WHERE child_id = ? AND role = 'parent'`
        : `SELECT * FROM users WHERE username = ? AND role = 'admin'`;

    db.query(sql, [child_id || username], (err, result) => {
        if (err || result.length === 0) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }

        const user = result[0];

        // Compare the hashed password
        if (bcrypt.compareSync(password, user.password)) {
            // Generate JWT token
            const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });

            res.status(200).json({ message: 'Login successful', token });
        } else {
            res.status(400).json({ error: 'Invalid credentials' });
        }
    });
};
