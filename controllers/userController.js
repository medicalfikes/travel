const User = require('../models/userModel');
const bcrypt = require('bcryptjs');

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.getAll();
    res.json({
      success: true,
      data: users
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Gagal mengambil data user',
      error: error.message
    });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const user = await User.getById(req.params.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User tidak ditemukan'
      });
    }
    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Gagal mengambil data user',
      error: error.message
    });
  }
};

exports.createUser = async (req, res) => {
  try {
    const { nama, gmail, Alamat, password } = req.body;

    // Validasi data
    if (!nama || !gmail || !Alamat || !password) {
      return res.status(400).json({
        success: false,
        message: 'Nama, email, alamat dan password harus diisi'
      });
    }

    // Validasi email sudah terdaftar
    const existingUser = await User.findByEmail(gmail);
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Email sudah terdaftar'
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      nama,
      gmail,
      Alamat,
      password: hashedPassword
    });

    res.status(201).json({
      success: true,
      message: 'User berhasil dibuat',
      data: {
        id: newUser.id,
        nama: newUser.nama,
        gmail: newUser.gmail,
        Alamat: newUser.Alamat
      }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Gagal membuat user',
      error: error.message
    });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const { nama, gmail, Alamat } = req.body;

    // Cek apakah user ada
    const existingUser = await User.getById(req.params.id);
    if (!existingUser) {
      return res.status(404).json({
        success: false,
        message: 'User tidak ditemukan'
      });
    }

    const updatedUser = await User.update(req.params.id, { nama, gmail, Alamat });
    res.json({
      success: true,
      message: 'User berhasil diperbarui',
      data: updatedUser
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Gagal memperbarui user',
      error: error.message
    });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    // Cek apakah user ada
    const existingUser = await User.getById(req.params.id);
    if (!existingUser) {
      return res.status(404).json({
        success: false,
        message: 'User tidak ditemukan'
      });
    }

    await User.delete(req.params.id);
    res.json({
      success: true,
      message: 'User berhasil dihapus'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Gagal menghapus user',
      error: error.message
    });
  }
};
