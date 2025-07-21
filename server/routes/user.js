const express = require('express');
const User = require('../models/User');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Get user points
router.get('/points', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    res.json({ points: user.points });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch points', error: err.message });
  }
});

module.exports = router;
