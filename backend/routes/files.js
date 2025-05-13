const express = require('express');
const router = express.Router();
const File = require('../models/File');
const auth = require('../middleware/auth');
const checkAdmin = require('../middleware/adminauth.js');
const User = require('../models/User.js');
const multer=require("multer");
const {storage}=require("../utils/cloudinary.js");
const upload = multer({ storage });

// Upload file
router.post('/upload', auth, upload.single('file'), async (req, res) => {
  try {
    const file = new File({
      filename: req.file.originalname,
      title: req.body.title,
      url: req.file.path,
      isPublic: req.body.isPublic === 'true',
      userId: req.user._id
    });
    console.log("file upload", req.file.originalname, req.body.title, req.file.path);
    await file.save();
    res.json({ message: 'File uploaded successfully' });

  } catch (err) {
    console.log("file upload error", req.file?.originalname, req.body?.title, req.file?.path); // Safe logging
    console.error('Upload error:', err);
    res.status(500).json({ error: err.message });
  }
});


// Get public files
router.get('/public', async (req, res) => {
  try {
    const files = await File.find({ isPublic: true })
      .populate('userId', 'name email')
      .sort({ uploadedAt: -1 });

    res.json(files);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get user's workspace
router.get('/workspace/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).select('name');
    if (!user) return res.status(404).json({ error: 'User not found' });

    const files = await File.find({
      userId: req.params.userId,
      isPublic: true
    });

    res.json({
      user: {
        _id: user._id,
        name: user.name
      },
      files
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Admin: get user data
router.get('/admin/userdata', async (req, res) => {
  try {
    const users = await User.find({});
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Admin: get file data
router.get('/admin/filedata', async (req, res) => {
  try {
    const files = await File.find({});
    res.json(files);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get user's own files
router.get('/my-files', auth, async (req, res) => {
  try {
    const files = await File.find({ userId: req.user._id });
    res.json(files);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete file (user)
router.delete('/:id', auth, async (req, res) => {
  try {
    const file = await File.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!file) {
      return res.status(404).json({ error: 'File not found' });
    }

    res.json({ message: 'File deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Admin: delete any file
router.delete('/admin/:id', async (req, res) => {
  try {
    const file = await File.findOneAndDelete({ _id: req.params.id });
    if (!file) return res.status(404).json({ error: 'File not found' });

    res.json({ message: 'File deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Admin: delete user
router.delete('/admin/user/:id', async (req, res) => {
  try {
    const user = await User.findOneAndDelete({ _id: req.params.id });
    if (!user) return res.status(404).json({ error: 'User not found' });

    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
