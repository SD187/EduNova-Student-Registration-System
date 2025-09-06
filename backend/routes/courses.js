const express = require('express');
const router = express.Router();
const Course = require('../models/CourseMaterial');

// Get all courses
router.get('/', async (req, res) => {
  try {
    const courses = await Course.find({});
    res.json(courses);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Add course
router.post('/', async (req, res) => {
  try {
    const { grade, subject, resourceType, year, link } = req.body;
    if (!grade || !subject || !resourceType || !year || !link) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const newCourse = new Course({ grade, subject, resourceType, year, link });
    await newCourse.save();
    res.status(201).json({ message: 'Course added', course: newCourse });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update entire course
router.put('/:id', async (req, res) => {
  try {
    const { grade, subject, resourceType, year, link } = req.body;
    const course = await Course.findByIdAndUpdate(
      req.params.id,
      { grade, subject, resourceType, year, link },
      { new: true }
    );

    if (!course) return res.status(404).json({ message: 'Course not found' });
    res.json({ message: 'Course updated', course });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete course
router.delete('/:id', async (req, res) => {
  try {
    const course = await Course.findByIdAndDelete(req.params.id);
    if (!course) return res.status(404).json({ message: 'Course not found' });
    res.json({ message: 'Course deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
