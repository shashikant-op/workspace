const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({
  filename: String,
  title: String,
  url: String, // Store Cloudinary URL
  isPublic: Boolean,
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  uploadedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('File', fileSchema);
