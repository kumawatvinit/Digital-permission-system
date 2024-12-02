const express = require('express');
const Request = require('../models/Request');
const { auth, roleAuth } = require('../middleware/auth');
const validate = require('../validations/validate');
const requestValidationRules = require('../validations/requestRules');

const router = express.Router();

// Create request
router.post('/', auth, roleAuth(['student']), validate(requestValidationRules.create), async (req, res) => {
  try {
    const request = new Request({
      ...req.body,
      studentId: req.user._id,
      status: 'pending',
      createdAt: new Date()
    });
    await request.save();
    res.status(201).json(request);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get student requests
router.get('/student', auth, roleAuth(['student']), async (req, res) => {
  try {
    const { page = 1, limit = 10, status, type } = req.query;

    const query = {
      studentId: req.user._id,
      ...(status && status !== 'all' ? { status } : {}),
      ...(type ? { type } : {})
    };

    const total = await Request.countDocuments(query);
    const requests = await Request.find(query)
      .populate('studentId', 'name email batch')
      .populate('professorId', 'name email')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    res.json({
      requests,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalItems: total
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get professor requests
router.get('/professor', auth, roleAuth(['professor']), async (req, res) => {
  try {
    const { page = 1, limit = 10, status, type } = req.query;

    const query = {
      professorId: req.user._id,
      ...(status && status !== 'all' ? { status } : {}),
      ...(type ? { type } : {})
    };

    const total = await Request.countDocuments(query);
    const requests = await Request.find(query)
      .populate('studentId', 'name email batch')
      .populate('professorId', 'name email')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    res.json({
      requests,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalItems: total
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update request
router.put('/:id', auth, validate(requestValidationRules.update), async (req, res) => {
  try {
    const request = await Request.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(request);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;