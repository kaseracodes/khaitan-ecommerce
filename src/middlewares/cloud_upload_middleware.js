const multer = require("multer");
const multerS3 = require("multer-s3");
const { S3Client } = require("@aws-sdk/client-s3");
const path = require("path");

const {AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_REGION, AWS_S3_BUCKET} = require("../config/server_config")

const s3 = new S3Client({
  region: AWS_REGION,
  credentials: {
    accessKeyId: AWS_ACCESS_KEY_ID,
    secretAccessKey: AWS_SECRET_ACCESS_KEY,
  },
});

// Allowed file types
const allowedTypes = [
    "image/jpeg", "image/png", "image/jpg", "image/webp", // Images
    "video/mp4", "video/mkv", "video/webm", "video/quicktime", // Videos
    "application/pdf"
];

const uploadMiddleware = (folder) => multer({
  storage: multerS3({
    s3: s3,
    bucket: AWS_S3_BUCKET,
    metadata: (req, file, cb) => {
      cb(null, { fieldName: file.fieldname });
    },
    key: (req, file, cb) => {
      const fileExtension = path.extname(file.originalname);
      const fileName = `${Date.now()}-${file.originalname}`;

      // Store files in different folders based on `folder` argument
      const filePath = `${folder}/${fileName}`;
      cb(null, filePath);
    },
    contentType: multerS3.AUTO_CONTENT_TYPE, // Automatically detect MIME type
  }),
  fileFilter: (req, file, cb) => {
    if (!allowedTypes.includes(file.mimetype)) {
      return cb(new BadRequest("Invalid file type", file.mimetype, "Allowed formats: JPG, PNG, WebP, MP4, MKV, WebM, PDF"), false);
    }
    cb(null, true);
  },
  limits: { fileSize: 10 * 1024 * 1024 }, // Limit file size to 10MB
});

module.exports = uploadMiddleware;


