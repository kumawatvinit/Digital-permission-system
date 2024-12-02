const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const validate = require('../validations/validate');
const userValidationRules = require('../validations/userRules');
const { auth, roleAuth } = require('../middleware/auth');

const router = express.Router();

// Register
router.post('/register', validate(userValidationRules.register), async (req, res) => {
  try {
    const { name, email, password, role, batch, batches } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      name,
      email,
      password: hashedPassword,
      role,
      ...(role === 'student' ? { batch } : { batches }),
    });

    await user.save();
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
    res.status(201).json({ token, user });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Login
router.post('/login', validate(userValidationRules.login), async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
    res.json({ token, user });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all professors
router.get('/professors', auth, async (req, res) => {
  try {
    const professors = await User.find({ role: 'professor' }).select('_id name');
    res.json(professors);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update User
router.put('/update', auth, async (req, res) => {
  try {
    const { name, email, role, batch, batches } = req.body;
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.name = name || user.name;
    user.email = email || user.email;
    user.role = role || user.role;
    user.batch = batch || user.batch;
    user.batches = batches || user.batches;

    await user.save();
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;