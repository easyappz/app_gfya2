const express = require('express');
const multer = require('multer');
const Photo = require('../models/Photo');
const User = require('../models/User');
const Rating = require('../models/Rating');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage });

// Upload photo
router.post('/upload', authMiddleware, upload.single('photo'), async (req, res) => {
  try {
    const photo = new Photo({
      userId: req.userId,
      url: req.file.path
    });
    await photo.save();
    res.status(201).json({ message: 'Photo uploaded', photoId: photo._id });
  } catch (err) {
    res.status(500).json({ message: 'Upload failed', error: err.message });
  }
});

// Activate photo for rating
router.post('/:photoId/activate', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (user.points < 1) {
      return res.status(403).json({ message: 'Not enough points to activate photo' });
    }

    const photo = await Photo.findOne({ _id: req.params.photoId, userId: req.userId });
    if (!photo) {
      return res.status(404).json({ message: 'Photo not found' });
    }

    photo.isActive = true;
    await photo.save();
    res.json({ message: 'Photo activated for rating' });
  } catch (err) {
    res.status(500).json({ message: 'Activation failed', error: err.message });
  }
});

// Deactivate photo
router.post('/:photoId/deactivate', authMiddleware, async (req, res) => {
  try {
    const photo = await Photo.findOne({ _id: req.params.photoId, userId: req.userId });
    if (!photo) {
      return res.status(404).json({ message: 'Photo not found' });
    }

    photo.isActive = false;
    await photo.save();
    res.json({ message: 'Photo deactivated' });
  } catch (err) {
    res.status(500).json({ message: 'Deactivation failed', error: err.message });
  }
});

// Set filters for photo
router.post('/:photoId/filters', authMiddleware, async (req, res) => {
  try {
    const { gender, age } = req.body;
    const photo = await Photo.findOne({ _id: req.params.photoId, userId: req.userId });
    if (!photo) {
      return res.status(404).json({ message: 'Photo not found' });
    }

    photo.genderFilter = gender || photo.genderFilter;
    photo.ageFilter = age || photo.ageFilter;
    await photo.save();
    res.json({ message: 'Filters updated' });
  } catch (err) {
    res.status(500).json({ message: 'Filter update failed', error: err.message });
  }
});

// Get photos for rating with filters
router.get('/for-rating', authMiddleware, async (req, res) => {
  try {
    const { gender, age } = req.query;
    const filter = { isActive: true, userId: { $ne: req.userId } };

    if (gender && gender !== 'all') {
      filter.genderFilter = { $in: ['all', gender] };
    }
    if (age && age !== 'all') {
      filter.ageFilter = { $in: ['all', age] };
    }

    const photos = await Photo.find(filter).limit(1);
    res.json(photos);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch photos', error: err.message });
  }
});

// Rate a photo
router.post('/:photoId/rate', authMiddleware, async (req, res) => {
  try {
    const { score, raterGender, raterAge } = req.body;
    const photo = await Photo.findById(req.params.photoId);
    if (!photo || !photo.isActive) {
      return res.status(404).json({ message: 'Photo not found or not active' });
    }

    if (photo.userId.toString() === req.userId.toString()) {
      return res.status(403).json({ message: 'Cannot rate your own photo' });
    }

    const rating = new Rating({
      photoId: req.params.photoId,
      userId: req.userId,
      score,
      raterGender,
      raterAge
    });
    await rating.save();

    photo.ratings.push(rating._id);
    await photo.save();

    // Update points: +1 for rater, -1 for photo owner
    await User.findByIdAndUpdate(req.userId, { $inc: { points: 1 } });
    await User.findByIdAndUpdate(photo.userId, { $inc: { points: -1 } });

    res.json({ message: 'Photo rated', ratingId: rating._id });
  } catch (err) {
    res.status(500).json({ message: 'Rating failed', error: err.message });
  }
});

// Get photo statistics
router.get('/:photoId/stats', authMiddleware, async (req, res) => {
  try {
    const photo = await Photo.findOne({ _id: req.params.photoId, userId: req.userId });
    if (!photo) {
      return res.status(404).json({ message: 'Photo not found' });
    }

    const ratings = await Rating.find({ photoId: req.params.photoId });
    const stats = {
      totalRatings: ratings.length,
      averageScore: ratings.length ? ratings.reduce((sum, r) => sum + r.score, 0) / ratings.length : 0,
      genderBreakdown: {
        male: ratings.filter(r => r.raterGender === 'male').length,
        female: ratings.filter(r => r.raterGender === 'female').length,
        other: ratings.filter(r => r.raterGender === 'other').length
      },
      ageBreakdown: {
        '18-25': ratings.filter(r => r.raterAge === '18-25').length,
        '26-35': ratings.filter(r => r.raterAge === '26-35').length,
        '36-50': ratings.filter(r => r.raterAge === '36-50').length,
        '50+': ratings.filter(r => r.raterAge === '50+').length
      }
    };

    res.json(stats);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch statistics', error: err.message });
  }
});

// Get user's photos
router.get('/my-photos', authMiddleware, async (req, res) => {
  try {
    const photos = await Photo.find({ userId: req.userId });
    res.json(photos);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch user photos', error: err.message });
  }
});

module.exports = router;
