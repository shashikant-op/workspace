const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// Cloudinary Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_CLOUD_API_KEY,
  api_secret: process.env.CLOUDINARY_CLOUD_API_SECRET
});

// Cloudinary Storage Setup
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "workspace", // Customize your folder name here
    allowed_formats: ['jpg', 'png', 'pdf', 'docx', 'xlsx', 'mp4', 'txt'],
    public_id: (req, file) => `${Date.now()}-${file.originalname}`,
    resource_type: 'auto' // Auto-detect file type
  }
});

module.exports = {
  cloudinary,
  storage
};
