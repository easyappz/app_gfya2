const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const photoRoutes = require('./routes/photos');
const userRoutes = require('./routes/user');

const router = express.Router();

// Enable CORS
router.use(cors());
router.use(express.json());

// Routes
router.use('/auth', authRoutes);
router.use('/photos', photoRoutes);
router.use('/user', userRoutes);

// GET /api/hello
router.get('/hello', (req, res) => {
  res.json({ message: 'Hello from API!' });
});

// GET /api/status
router.get('/status', (req, res) => {
  res.json({ 
    status: 'ok',
    timestamp: new Date().toISOString()
  });
});

module.exports = router;
