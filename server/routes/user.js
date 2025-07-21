const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Photo = require('../models/Photo');
const authMiddleware = require('../middleware/auth');

// Get user profile
router.get('/profile', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch profile', error: error.message });
  }
});

// Get user statistics
router.get('/statistics', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.userId;
    const photoCount = await Photo.countDocuments({ userId });
    const photos = await Photo.find({ userId });

    let totalRatings = 0;
    let ratingCount = 0;

    photos.forEach(photo => {
      photo.ratings.forEach(rating => {
        totalRatings += rating.rating;
        ratingCount++;
      });
    });

    const averageRating = ratingCount > 0 ? totalRatings / ratingCount : 0;

    res.json({
      photoCount,
      averageRating: averageRating.toFixed(2),
      totalRatings: ratingCount
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch statistics', error: error.message });
  }
});

module.exports = router;
