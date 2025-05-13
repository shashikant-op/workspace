const express = require('express');
const router = express.Router();
const File = require('../models/File');
const auth = require('../middleware/auth');
const checkAdmin = require('../middleware/adminauth.js');
const User = require('../models/User.js');
const multer=require("multer");
const {storage}=require("../utils/cloudinary.js");
const upload = multer({ storage });

// In your upload route
router.post('/upload', auth, upload.single('file'), async (req, res) => {
  try {
    // Validate file existence
    if (!req.file) {
      return res.status(400).json({ 
        error: 'No file uploaded. Please select a file.' 
      });
    }

    // Verify Cloudinary upload succeeded
    if (!req.file.path || !req.file.public_id) {
      console.error('Cloudinary upload failed. File details:', req.file);
      throw new Error('Failed to store file in cloud storage');
    }

    // Validate required fields
    if (!req.body.title) {
      return res.status(400).json({ 
        error: 'Title is required for file upload' 
      });
    }

    // Create new file document
    const file = new File({
      filename: req.file.originalname,
      title: req.body.title,
      url: req.file.path,
      publicId: req.file.public_id,  // Store public_id for future management
      isPublic: req.body.isPublic === 'true',
      userId: req.user._id
    });

    // Save to database
    await file.save();

    // Send success response
    res.status(201).json({
      message: 'File uploaded successfully',
      file: {
        id: file._id,
        title: file.title,
        url: file.url,
        isPublic: file.isPublic,
        uploadedAt: file.uploadedAt
      }
    });

  } catch (err) {
    console.error('Upload error:', err);
    
    // Cleanup failed Cloudinary upload
    if (req.file?.public_id) {
      await cloudinary.uploader.destroy(req.file.public_id)
        .catch(cleanupError => 
          console.error('Cleanup failed:', cleanupError)
        );
    }

    // Error response
    const response = {
      error: 'File upload failed',
      details: process.env.NODE_ENV === 'production' 
        ? 'Please try again later' 
        : err.message
    };

    res.status(err instanceof mongoose.Error.ValidationError ? 400 : 500)
       .json(response);
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
