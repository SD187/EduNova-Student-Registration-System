// Import necessary modules
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

// Initialize the Express app
const app = express();
const port = 3000; // You can change this port

// Middleware
app.use(cors()); // Enables Cross-Origin Resource Sharing
app.use(bodyParser.json()); // Parses incoming JSON requests
app.use(bodyParser.urlencoded({ extended: true })); // Parses URL-encoded data

// Define the path to the feedback data file
const feedbackFilePath = path.join(__dirname, 'feedback.json');

// --- API Endpoint for Feedback Submission ---
app.post('/api/feedback', (req, res) => {
    // Extract name and comment from the request body
    const { name, comment } = req.body;

    // Basic validation
    if (!name || !comment) {
        return res.status(400).json({ success: false, message: 'Name and comment are required.' });
    }

    // Create a new feedback object with a timestamp
    const newFeedback = {
        name,
        comment,
        timestamp: new Date().toISOString()
    };

    // Read existing feedback from the file
    fs.readFile(feedbackFilePath, (err, data) => {
        let feedbackData = [];

        // If the file exists, parse its content
        if (!err) {
            try {
                feedbackData = JSON.parse(data);
            } catch (parseError) {
                console.error("Error parsing feedback file:", parseError);
                // If there's a parse error, we'll just start with an empty array
            }
        }

        // Add the new feedback to the array
        feedbackData.push(newFeedback);

        // Write the updated array back to the file
        fs.writeFile(feedbackFilePath, JSON.stringify(feedbackData, null, 2), (writeErr) => {
            if (writeErr) {
                console.error("Error writing to feedback file:", writeErr);
                return res.status(500).json({ success: false, message: 'Failed to save feedback.' });
            }

            console.log('Feedback saved successfully:', newFeedback);
            res.status(200).json({ success: true, message: 'Thank you for your feedback!' });
        });
    });
});

// --- API Endpoint to Get Testimonials ---
app.get('/api/testimonials', (req, res) => {
    fs.readFile(feedbackFilePath, (err, data) => {
        if (err) {
            // If file doesn't exist, return an empty array
            if (err.code === 'ENOENT') {
                return res.status(200).json([]);
            }
            console.error("Error reading feedback file:", err);
            return res.status(500).json({ success: false, message: 'Failed to retrieve testimonials.' });
        }

        try {
            const feedbackData = JSON.parse(data);
            // You might want to sort or limit this data before sending it
            res.status(200).json(feedbackData);
        } catch (parseError) {
            console.error("Error parsing feedback file:", parseError);
            res.status(500).json({ success: false, message: 'Failed to parse testimonial data.' });
        }
    });
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});