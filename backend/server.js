// In server.js or a new route file
/*const express = require('express');
const cors = require('cors'); // Import CORS middleware
const jwt = require('jsonwebtoken');
const db = require('./config/db'); // Correct path to db.js inside the config folder
const app = express();
const port = 3000;
const bodyParser = require('body-parser');
const authRoutes = require('./routes/authRoutes');

// Middleware for verifying JWT token
const verifyToken = (req, res, next) => {
    const token = req.headers['authorization'];

    if (!token) return res.status(403).json({ message: 'No token provided' });

    jwt.verify(token, 'your_jwt_secret', (err, decoded) => {
        if (err) return res.status(500).json({ message: 'Failed to authenticate token' });
        req.userId = decoded.userId;
        req.role = decoded.role;
        next();
    });
};
app.use(cors()); // This enables all CORS requests, modify for security as needed.

app.use(express.json());

app.use(bodyParser.json());
app.use('/api/auth', authRoutes);

// Admin Dashboard (only accessible by admin)
app.get('/dashboard/admin', verifyToken, (req, res) => {
    if (req.role !== 'admin') return res.status(403).json({ message: 'Access denied' });

    db.query('SELECT * FROM children', (err, result) => {
        if (err) throw err;
        res.json({ message: 'Admin Dashboard', children: result });
    });
});

// Parent Dashboard (only accessible by parent)
app.get('/dashboard/parent', verifyToken, (req, res) => {
    if (req.role !== 'parent') return res.status(403).json({ message: 'Access denied' });

    db.query(`SELECT * FROM children WHERE child_id = (SELECT child_id FROM users WHERE id = ${req.userId})`, (err, result) => {
        if (err) throw err;
        res.json({ message: 'Parent Dashboard', childData: result });
    });
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
*/

const path = require('path');

const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const db = require('./config/db');
const bcrypt = require('bcryptjs'); // Add bcrypt for password hashing
const app = express();
const port = 3000;
const bodyParser = require('body-parser');
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');

// CORS setup to allow only requests from frontend (127.0.0.1:5500)
const corsOptions = {
    origin: 'http://127.0.0.1:5500', // Explicitly allow your frontend
    methods: ['GET', 'POST'],  // Allow specific methods
    allowedHeaders: ['Content-Type', 'Authorization'],  // Allow specific headers
};

app.use(cors(corsOptions)); // Use the CORS middleware with the specified options
app.use(express.static(path.join(__dirname, 'frontend')));

app.use(express.json());
app.use(bodyParser.json());
app.use('/api/auth', authRoutes);
app.use('/admin', adminRoutes);
app.use(express.static('frontend'));


// Middleware for verifying JWT token
const verifyToken = (req, res, next) => {
    const token = req.headers['authorization'];

    if (!token) {
        return res.status(403).json({ message: 'No token provided' });
    }

    const tokenWithoutBearer = token.startsWith('Bearer ') ? token.slice(7) : token;

    jwt.verify(tokenWithoutBearer, 'your_jwt_secret', (err, decoded) => {
        if (err) {
            return res.status(500).json({ message: 'Failed to authenticate token' });
        }
        req.userId = decoded.id;
        req.role = decoded.role;
        next();
    });
};
app.post('/api/auth/register', (req, res) => {
    console.log(req.body);  
    const { username, password, role, child_id } = req.body;

    // Hash the password before inserting into the database
    bcrypt.hash(password, 10, (err, hashedPassword) => {
        if (err) return res.status(500).json({ message: 'Error hashing password' });

        // Insert into the users table
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
/*app.get('/', (req, res) => {
    res.sendFile(__dirname + '/frontend/dashboard/admin.html');
});*/
// Admin Dashboard (only accessible by admin)
app.get('/dashboard/admin', verifyToken, (req, res) => {
    if (req.role !== 'admin') {
        return res.status(403).json({ message: 'Access denied' });
    }

    db.query('SELECT * FROM children', (err, result) => {
        if (err) {
            return res.status(500).json({ message: 'Error fetching data' });
        }
        res.json({ message: 'Admin Dashboard', children: result });
    });
});

// Parent Dashboard (only accessible by parent)
app.get('/dashboard/parent', verifyToken, (req, res) => {
    if (req.role !== 'parent') {
        return res.status(403).json({ message: 'Access denied' });
    }

    db.query(`SELECT * FROM children WHERE child_id = (SELECT child_id FROM users WHERE id = ${req.userId})`, (err, result) => {
        if (err) {
            return res.status(500).json({ message: 'Error fetching data' });
        }
        res.json({ message: 'Parent Dashboard', childData: result });
    });
});


// Mock data for demonstration purposes
app.get('/admin/overview', (req, res) => {
    const overviewData = {
        totalChildren: 100, // Example: Replace with a database query
        upcomingVaccinations: 20, // Example: Replace with a database query
    };
    res.json(overviewData);
});

app.get('/admin/vaccines', (req, res) => {
    const vaccineData = [
        { name: 'Polio', type: 'Oral', dosage: '2 drops', manufacturer: 'XYZ Pharma' },
        { name: 'Hepatitis B', type: 'Injection', dosage: '1 ml', manufacturer: 'ABC Pharma' },
    ];
    res.json(vaccineData);
});


app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
