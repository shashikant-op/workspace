const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// Correct environment variable names (should match Render's dashboard)
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,  // Fixed variable name
  api_key: process.env.CLOUDINARY_API_KEY,        // Fixed variable name
  api_secret: process.env.CLOUDINARY_API_SECRET   // Fixed variable name
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "workspace",
    allowed_formats: ['jpg', 'png', 'pdf', 'docx', 'xlsx', 'mp4', 'txt'], // Fixed param name (underscore)
    public_id: (req, file) => `${Date.now()}-${file.originalname}`, // Template literal for clarity
    resource_type: 'auto' // Automatically detect file type
  }
});

module.exports = {
  cloudinary,
  storage
};