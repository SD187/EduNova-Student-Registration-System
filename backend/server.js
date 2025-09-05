// server.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

// Import feedback routes
const feedbackRoutes = require('./routes/feedback'); // Ensure path is correct

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from public directory
app.use(express.static(path.join(__dirname, '../public')));
app.use('/shared', express.static(path.join(__dirname, '../shared')));
app.use('/admin', express.static(path.join(__dirname, '../admin')));

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/edunova', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

// Timetable schema
const timetableSchema = new mongoose.Schema({
    day: String,
    time: String,
    subject: String,
    grade: String,
    date: String,
    start_time: String,
    end_time: String,
    startTime: String,
    endTime: String
});
const Timetable = mongoose.model('Timetable', timetableSchema);

// Feedback routes
app.use('/api/feedback', feedbackRoutes);

// Timetable routes
app.post('/api/timetable', async (req, res) => {
    try {
        const entries = req.body.entries; // Array of timetable entries
        await Timetable.deleteMany({}); // Clear old timetable
        await Timetable.insertMany(entries);
        res.json({ message: 'Timetable saved', entries });
    } catch (err) {
        console.error('Error saving timetable:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

app.get('/api/timetable', async (req, res) => {
    try {
        const entries = await Timetable.find({});
        res.json({ entries });
    } catch (err) {
        console.error('Error fetching timetable:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Serve main pages
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

app.get('/about', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/about.html'));
});

app.get('/courses', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/courses.html'));
});

app.get('/timetable', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/timetable.html'));
});

app.get('/contact', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/Contact.html'));
});

// Test route
app.get('/api', (req, res) => res.send('Backend API is working!'));

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
