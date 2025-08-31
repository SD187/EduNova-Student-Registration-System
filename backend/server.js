// server.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Import feedback routes
const feedbackRoutes = require('./routes/feedback'); // Ensure path is correct

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
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
    grade: String
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

// Test route
app.get('/', (req, res) => res.send('Backend is working!'));

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
