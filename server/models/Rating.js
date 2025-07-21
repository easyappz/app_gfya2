const mongoose = require('mongoose');

const RatingSchema = new mongoose.Schema({
  photoId: { type: mongoose.Schema.Types.ObjectId, ref: 'Photo', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  score: { type: Number, required: true },
  raterGender: { type: String, enum: ['male', 'female', 'other'], default: 'other' },
  raterAge: { type: String, enum: ['18-25', '26-35', '36-50', '50+'], default: '18-25' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Rating', RatingSchema);
