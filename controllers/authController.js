// controllers/authController.js

const Auth = require('../models/authModel');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
  try {
    const { nama, gmail, password } = req.body;

    // Validasi input
    if (!nama || !gmail || !password) {
      return res.status(400).json({ 
        success: false,
        message: 'Nama, email, dan password harus diisi' 
      });
    }

    // Cek apakah email sudah terdaftar
    const existingUser = await Auth.findByEmail(gmail);
    if (existingUser) {
      return res.status(409).json({ 
        success: false,
        message: 'Email sudah terdaftar' 
      });
    }

    // Buat user baru
    const newUser = await Auth.createUser({ nama, gmail, password });

    // Generate token
    const token = jwt.sign(
      { id: newUser.id, gmail: newUser.gmail },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '1h' }
    );

    res.status(201).json({
      success: true,
      message: 'Registrasi berhasil',
      token,
      user: {
        id: newUser.id,
        nama: newUser.nama,
        gmail: newUser.gmail
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Terjadi kesalahan server' 
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { gmail, password } = req.body;

    // Validasi input
    if (!gmail || !password) {
      return res.status(400).json({ 
        success: false,
        message: 'Email dan password harus diisi' 
      });
    }

    // Verifikasi kredensial
    const user = await Auth.verifyCredentials(gmail, password);
    if (!user) {
      return res.status(401).json({ 
        success: false,
        message: 'Email atau password salah' 
      });
    }

    // Generate token
    const token = jwt.sign(
      { id: user.id, gmail: user.gmail },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '1h' }
    );

    res.json({
      success: true,
      message: 'Login berhasil',
      token,
      user: {
        id: user.id,
        nama: user.nama,
        gmail: user.gmail
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Terjadi kesalahan server' 
    });
  }
};

exports.getMe = async (req, res) => {
  try {
    const user = await Auth.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ 
        success: false,
        message: 'User tidak ditemukan' 
      });
    }

    res.json({ 
      success: true,
      user 
    });
  } catch (error) {
    console.error('Get me error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Terjadi kesalahan server' 
    });
  }
};
