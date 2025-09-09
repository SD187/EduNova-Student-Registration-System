const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// For demo: Hardcoded admin credentials (in real app, use DB + hashing)
const ADMIN_USERNAME = 'admin';
const ADMIN_PASSWORD = 'password123';

// Login API endpoint
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ success: false, message: 'Username and password are required' });
    }

    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
        // In real apps, send JWT or session info
        return res.json({ success: true, message: 'Login successful' });
    } else {
        return res.status(401).json({ success: false, message: 'Invalid username or password' });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
