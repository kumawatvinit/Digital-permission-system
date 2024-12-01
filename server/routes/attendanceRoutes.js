const express = require('express');
const Attendance = require('../models/Attendance');
const { auth, roleAuth } = require('../middleware/auth');
const { validate, attendanceValidationRules } = require('../validations/attendanceRules');

const router = express.Router();

// Create attendance
router.post('/', auth, roleAuth(['professor']), validate(attendanceValidationRules.create), async (req, res) => {
  try {
    const attendance = new Attendance({
      ...req.body,
      professorId: req.user._id,
    });
    await attendance.save();
    res.status(201).json(attendance);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get professor's attendance records
router.get('/professor', auth, roleAuth(['professor']), async (req, res) => {
  try {
    const records = await Attendance.find({ professorId: req.user._id });
    res.json(records);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get student's batch attendance
router.get('/student/:batch', auth, roleAuth(['student']), async (req, res) => {
  try {
    const records = await Attendance.find({ 
      batch: req.params.batch,
      status: 'active',
    });
    res.json(records);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Submit attendance
router.post('/:id/submit', auth, roleAuth(['student']), validate(attendanceValidationRules.submit), async (req, res) => {
  try {
    const attendance = await Attendance.findById(req.params.id);
    attendance.students.push({
      studentId: req.user._id,
      status: req.body.status,
      submittedAt: new Date(),
    });
    await attendance.save();
    res.json(attendance);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;