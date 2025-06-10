const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Buat folder uploads jika belum ada
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const name = path.basename(file.originalname, ext).toLowerCase().split(' ').join('-');
    cb(null, `destinasi-${Date.now()}${ext}`);
  }
});

const fileFilter = (req, file, cb) => {
  const filetypes = /jpe?g|png|webp|gif/;
  const mimetype = filetypes.test(file.mimetype);
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

  if (mimetype && extname) {
    return cb(null, true);
  }
  cb(new Error('Error: Hanya file gambar yang diperbolehkan (JPEG, PNG, WEBP, GIF)'));
};

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: fileFilter
});

const handleUploadErrors = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    return res.status(400).json({
      success: false,
      message: 'Error upload file',
      error: err.message
    });
  } else if (err) {
    return res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan pada server',
      error: err.message
    });
  }
  next();
};

module.exports = {
  upload,
  handleUploadErrors,
  uploadDir
};
