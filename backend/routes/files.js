const express = require('express');
const router = express.Router();
const File = require('../models/File');
const auth = require('../middleware/auth');
const multer = require('multer');
const path = require('path');
const checkAdmin=require('../middleware/adminauth.js');
const User =require("../models/User.js");

// Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
    console.log(file.originalname);
  }
});

const upload = multer({ storage });

// Upload 
router.post('/upload', auth, upload.single('file'), async (req, res) => {
  try {
    const file = new File({
      filename: req.file.filename,
      title:req.body.title,
      path: req.file.path,
      isPublic: req.body.isPublic === 'true',
      userId: req.user._id
    });
    await file.save();
    res.json({ message: 'File uploaded successfully' });
  } catch (err) {
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


//admin routes

//get user details

router.get("/admin/userdata",async(req,res)=>{
      const users=await User.find({});
      res.json(users);
});

//get file data 

router.get("/admin/filedata",async(req,res)=>{
  const files=await File.find({});
  res.json(files);
})


// Get user's files
router.get('/my-files', auth, async (req, res) => {
  try {
    const files = await File.find({ userId: req.user._id });
    res.json(files);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete file
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


// Delete file
router.delete('/admin/:id', async (req, res) => {
  try {
    const file = await File.findOneAndDelete({
      _id: req.params.id
    });

    if (!file) {
      return res.status(404).json({ error: 'File not found' });
    }

    res.json({ message: 'File deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete user
router.delete('/admin/user/:id', async (req, res) => {
  try {
    const user = await User.findOneAndDelete({
      _id: req.params.id
    });

    if (!user) {
      return res.status(404).json({ error: 'File not found' });
    }

    res.json({ message: 'File deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});



module.exports = router;
