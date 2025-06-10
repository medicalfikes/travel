// routes/authRoutes.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
// const authMiddleware = require('../middleware/authMiddleware');

// Register route
router.post('/register', authController.register);

// Login route
router.post('/login', authController.login);

// Get logged in user route (protected)
// router.get('/me', authMiddleware, authController.getMe);

module.exports = router;
