const express = require('express');
const Meeting = require('../models/Meeting');
const { auth, roleAuth } = require('../middleware/auth');
const validate = require('../validations/validate');
const meetingValidationRules = require('../validations/meetingRules');

const router = express.Router();

// Create meeting
router.post('/', auth, roleAuth(['professor']), validate(meetingValidationRules.create), async (req, res) => {
  try {
    const meeting = new Meeting({
      ...req.body,
      professorId: req.user._id,
    });
    await meeting.save();
    res.status(201).json(meeting);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get professor's meetings
router.get('/', auth, roleAuth(['professor']), async (req, res) => {
  try {
    const meetings = await Meeting.find({ professorId: req.user._id });
    res.json(meetings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update meeting
router.put('/:id', auth, roleAuth(['professor']), validate(meetingValidationRules.update), async (req, res) => {
  try {
    const meeting = await Meeting.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(meeting);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete meeting
router.delete('/:id', auth, roleAuth(['professor']), async (req, res) => {
  try {
    await Meeting.findByIdAndDelete(req.params.id);
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;