const multer = require("multer");
const path = require("path");

// Configure storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // Save files in 'uploads/' directory
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // Rename file with timestamp
  },
});

// Allowed file types
const allowedTypes = [
    "image/jpeg", "image/png", "image/jpg", "image/webp", // Images
    "video/mp4", "video/mkv", "video/webm", "video/quicktime", // Videos
    "application/pdf"
  ];

// File filter (optional) - Restrict file types
const fileFilter = (req, file, cb) => {
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new BadRequest("Invalid file type", file.mimetype, "Allowed formats: JPG, PNG, WebP, MP4, MKV, WebM, PDF"), false);
  }
};

// Initialize multer
const upload = multer({ 
  storage: storage, 
  fileFilter: fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 } // Limit file size to 10MB
});

module.exports = upload;
