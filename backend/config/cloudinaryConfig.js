// cloudinaryConfig.js
const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
// Configure Cloudinary Storage
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'uploads', // Your Cloudinary folder name
    allowed_formats: ['mp3', 'wav', 'ogg', 'webm'], // Allowed audio formats
    resource_type: 'auto', // Automatically resolve to image or video/audio based on the file uploaded
},
});
// Create multer instance
const upload = multer({ storage: storage });
module.exports = { upload, cloudinary }; // Export the upload instance