// const cloudinary = require('cloudinary').v2;
// const multer = require('multer');
// const { CloudinaryStorage } = require('multer-storage-cloudinary');
// // Configure Cloudinary
// cloudinary.config({
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET,
// });
// // Configure Cloudinary Storage
// const storage = new CloudinaryStorage({
//   cloudinary: cloudinary,
//   params: (req, file) => {
//     let folder = 'uploads'; // Your Cloudinary folder name
//     let resourceType = 'auto'; // Automatically resolve to image or video/audio based on the file uploaded
//     const allowedFormats = ['jpg', 'jpeg', 'png', 'gif', 'mp4', 'mp3', 'wav', 'ogg', 'webm']; // Allowed formats

//     console.log('File uploaded:', file.mimetype); // Log the MIME type
//     // Check the file type and set the resource type accordingly

//     if (file.mimetype.startsWith('image/')) {
//       resourceType = 'image';
//     } else if (file.mimetype.startsWith('video/')) {
//       resourceType = 'video';
//       console.log("video cloudinary");
//     } else if (file.mimetype.startsWith('audio/')) {
//       console.log("audio cloudinary");
//       resourceType = 'audio';
//     }
//     return {
//       folder: folder,
//       allowed_formats: allowedFormats,
//       resource_type: resourceType, // Automatically resolve
//     };
//   },
// });
// // Create multer instance
// const upload = multer({ storage: storage });
// module.exports = { upload, cloudinary }; // Export the upload instance

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
    allowed_formats: ['mp3', 'wav', 'ogg', 'webm','jpg', 'jpeg', 'png', 'gif', 'mp4',], // Allowed audio formats
    resource_type: 'auto', // Automatically resolve to image or video/audio based on the file uploaded
    
},

});
// Create multer instance
const upload = multer({ storage: storage });
module.exports = { upload, cloudinary }; // Export the upload instance

