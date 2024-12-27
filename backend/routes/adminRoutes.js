const express = require('express');
const router = express.Router();
const db = require('../config/db'); // Import the database connection

// Overview route: Fetch total children and upcoming vaccinations
router.get('/overview', async (req, res) => {
    try {
        const totalChildrenQuery = 'SELECT COUNT(*) AS totalChildren FROM children';
        const upcomingVaccinationsQuery = `
            SELECT COUNT(*) AS upcomingVaccinations
            FROM vaccine_record
            WHERE next_due_date >= CURDATE() AND next_due_date <= DATE_ADD(CURDATE(), INTERVAL 30 DAY)
        `;

        const [totalChildrenResult] = await db.promise().query(totalChildrenQuery);
        const [upcomingVaccinationsResult] = await db.promise().query(upcomingVaccinationsQuery);

        res.status(200).json({
            totalChildren: totalChildrenResult[0]?.totalChildren || 0,
            upcomingVaccinations: upcomingVaccinationsResult[0]?.upcomingVaccinations || 0,
        });
    } catch (err) {
        console.error('Error fetching overview data:', err.message);
        res.status(500).json({ message: 'Failed to fetch overview data' });
    }
});


// Route to fetch all children data
router.get('/children', async (req, res) => {
    try {
        const [children] = await db.promise().query('SELECT * FROM children');
        res.status(200).json(children);
    } catch (err) {
        console.error('Error fetching children data:', err.message);
        res.status(500).json({ message: 'Failed to fetch children data' });
    }
});

// Route to add a child
router.post('/children', (req, res) => {
    const { name, age, vaccinationStatus } = req.body;
    db.query('INSERT INTO children (name, age, vaccination_status) VALUES (?, ?, ?)', 
        [name, age, vaccinationStatus], 
        (err, result) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ message: 'Error adding child' });
            }
            res.json({ message: 'Child added successfully' });
        }
    );
});

// Route to fetch all vaccines
router.get('/vaccine-records', async (req, res) => {
    try {
        const query = `
            SELECT 
                c.child_name, 
                v.v_name AS vaccine_name, 
                vr.administered_date, 
                vr.next_due_date
            FROM vaccine_record vr
            INNER JOIN children c ON vr.child_id = c.child_id
            INNER JOIN vaccine v ON vr.v_id = v.v_id
        `;
        const [records] = await db.promise().query(query);
        res.status(200).json(records);
    } catch (err) {
        console.error('Error fetching vaccine records:', err.message);
        res.status(500).json({ message: 'Failed to fetch vaccine records' });
    }
});

// Route to add a vaccine
router.post('/vaccine', async (req, res) => {
    const { name, type, dosage, manufacturer } = req.body;
    if (!name || !type || !dosage || !manufacturer) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    try {
        const [result] = await db.promise().query(
            'INSERT INTO vaccine (name, type, dosage, manufacturer) VALUES (?, ?, ?, ?)',
            [name, type, dosage, manufacturer]
        );
        res.status(201).json({ message: 'Vaccine added successfully', vaccineId: result.insertId });
    } catch (err) {
        console.error('Error adding vaccine:', err.message);
        res.status(500).json({ message: 'Failed to add vaccine' });
    }
});

// Placeholder for additional routes
// Add similar routes for health records, physical records, hospitals, caretakers, etc.

module.exports = router;
