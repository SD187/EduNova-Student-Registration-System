const express = require('express');
const router = express.Router();
const Feedback = require('../models/Feedback');

// POST: Add new feedback
router.post('/', async (req, res) => {
  try {
    const { name, message } = req.body;
    const feedback = new Feedback({ name, message });
    await feedback.save();
    res.status(201).json(feedback);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET: Fetch 2 most recent feedbacks
router.get('/', async (req, res) => {
  try {
    const feedbacks = await Feedback.find({})
      .sort({ createdAt: -1 }) // newest first
      .limit(2);
    res.json(feedbacks);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
