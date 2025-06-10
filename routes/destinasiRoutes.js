const express = require('express');
const router = express.Router();
const destinasiController = require('../controllers/destinasiController');
const { upload, handleUploadErrors } = require('../config/multerConfig');

// Create dengan upload gambar
router.post('/', 
  upload.single('gambar'),
  handleUploadErrors,
  destinasiController.createDestinasi
);

// Get all
router.get('/', destinasiController.getAllDestinasi);

// Get by ID
router.get('/:id', destinasiController.getDestinasiById);

// Update dengan upload gambar
router.put('/:id',
  upload.single('gambar'),
  handleUploadErrors,
  destinasiController.updateDestinasi
);

// Delete
router.delete('/:id', destinasiController.deleteDestinasi);

// Search
router.get('/search', destinasiController.searchDestinasi);

module.exports = router;
