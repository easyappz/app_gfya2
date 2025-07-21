const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const Photo = require('../models/Photo');
const authMiddleware = require('../middleware/auth');

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../uploads'));
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage });

// Upload photo
router.post('/upload', authMiddleware, upload.single('photo'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const photo = new Photo({
      userId: req.user.userId,
      filename: req.file.filename,
      path: req.file.path,
      originalName: req.file.originalname
    });

    await photo.save();
    res.status(201).json({ message: 'Photo uploaded successfully', photo });
  } catch (error) {
    res.status(500).json({ message: 'Photo upload failed', error: error.message });
  }
});

// Get all photos
router.get('/', async (req, res) => {
  try {
    const photos = await Photo.find().populate('userId', 'username');
    res.json(photos);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch photos', error: error.message });
  }
});

// Get photos by user
router.get('/user', authMiddleware, async (req, res) => {
  try {
    const photos = await Photo.find({ userId: req.user.userId });
    res.json(photos);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch user photos', error: error.message });
  }
});

// Rate photo
router.post('/:id/rate', authMiddleware, async (req, res) => {
  try {
    const { rating } = req.body;
    if (rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5' });
    }

    const photo = await Photo.findById(req.params.id);
    if (!photo) {
      return res.status(404).json({ message: 'Photo not found' });
    }

    // Check if user already rated
    const existingRating = photo.ratings.find(r => r.userId.toString() === req.user.userId);
    if (existingRating) {
      existingRating.rating = rating;
    } else {
      photo.ratings.push({ userId: req.user.userId, rating });
    }

    await photo.save();
    res.json({ message: 'Rating added', photo });
  } catch (error) {
    res.status(500).json({ message: 'Failed to rate photo', error: error.message });
  }
});

// Filter photos by rating
router.get('/filter', async (req, res) => {
  try {
    const { minRating } = req.query;
    let query = {};

    if (minRating) {
      query = { 'ratings.rating': { $gte: parseInt(minRating) } };
    }

    const photos = await Photo.find(query).populate('userId', 'username');
    res.json(photos);
  } catch (error) {
    res.status(500).json({ message: 'Failed to filter photos', error: error.message });
  }
});

module.exports = router;
