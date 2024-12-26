const express = require('express');
const db = require('../config/db');
const router = express.Router();

// Endpoint to get children data
router.get('/children', (req, res) => {
    db.query('SELECT * FROM children', (err, result) => {
        if (err) return res.status(500).json({ message: 'Error fetching children' });
        res.json(result);  // Send children data
    });
});

// Endpoint to add a child
router.post('/children', (req, res) => {
    const { name, age, vaccinationStatus } = req.body;
    db.query('INSERT INTO children (name, age, vaccination_status) VALUES (?, ?, ?)', [name, age, vaccinationStatus], (err, result) => {
        if (err) return res.status(500).json({ message: 'Error adding child' });
        res.json({ message: 'Child added successfully' });
    });
});

// Endpoint to manage vaccines
router.get('/vaccines', (req, res) => {
    db.query('SELECT * FROM vaccines', (err, result) => {
        if (err) return res.status(500).json({ message: 'Error fetching vaccines' });
        res.json(result);  // Send vaccine data
    });
});

// Similar routes for health records, physical records, hospitals, caretakers

module.exports = router;
