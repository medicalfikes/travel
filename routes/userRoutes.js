const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Middleware validasi
const validateUserData = (req, res, next) => {
  const { nama, gmail, Alamat, password } = req.body;
  
  if (!nama?.trim()) {
    return res.status(400).json({
      success: false,
      message: 'Nama harus diisi'
    });
  }

  if (!gmail?.trim()) {
    return res.status(400).json({
      success: false,
      message: 'Email harus diisi'
    });
  }

  if (!Alamat?.trim()) {
    return res.status(400).json({
      success: false,
      message: 'Alamat harus diisi'
    });
  }

  if (!password?.trim()) {
    return res.status(400).json({
      success: false,
      message: 'Password harus diisi'
    });
  }

  // Validasi format email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(gmail)) {
    return res.status(400).json({
      success: false,
      message: 'Format email tidak valid'
    });
  }

  next();
};

// Routes
router.get('/', userController.getAllUsers);
router.get('/:id', userController.getUserById);
router.post('/', validateUserData, userController.createUser);
router.put('/:id', validateUserData, userController.updateUser);
router.delete('/:id', userController.deleteUser);

module.exports = router;
