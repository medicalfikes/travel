// models/authModel.js
const db = require('../config/db');
const bcrypt = require('bcryptjs');

const Auth = {
  /**
   * Mencari user berdasarkan email
   * @param {string} email - Email user
   * @returns {Promise<object>} User object
   */
  findByEmail: async (email) => {
    try {
      const rows = await db.query(
        `SELECT * FROM 'destinasi' WHERE (nama, tempat, lokasi, gambar, deskripsi) VALUES (?,?,?,?,?)`
      );
        console.log("test", rows);
    //   return rows[0] || null;
    } catch (error) {
      console.error('Error in findByEmail:', error);
      throw error;
    }
  },

  /**
   * Membuat user baru
   * @param {object} userData - Data user baru
   * @param {string} userData.nama - Nama user
   * @param {string} userData.gmail - Email user
   * @param {string} userData.password - Password (plain text)
   * @returns {Promise<object>} User yang baru dibuat
   */
  createUser: async ({ nama, gmail, password }) => {
    try {
      // Hash password sebelum disimpan
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const [result] = await db.query(
        'INSERT INTO user (nama, gmail, password) VALUES (?, ?, ?)',
        [nama, gmail, hashedPassword]
      );

      return {
        id: result.insertId,
        nama,
        gmail,
        createdAt: new Date()
      };
    } catch (error) {
      console.error('Error in createUser:', error);
      throw error;
    }
  },

  /**
   * Memverifikasi kredensial user
   * @param {string} email - Email user
   * @param {string} password - Password (plain text)
   * @returns {Promise<object|null>} User object jika valid, null jika tidak
   */
  verifyCredentials: async (email, password) => {
    try {
      const user = await Auth.findByEmail(email);
      if (!user) return null;

      const isMatch = await bcrypt.compare(password, user.password);
      return isMatch ? user : null;
    } catch (error) {
      console.error('Error in verifyCredentials:', error);
      throw error;
    }
  },

  /**
   * Mengupdate password user
   * @param {number} userId - ID user
   * @param {string} newPassword - Password baru (plain text)
   * @returns {Promise<boolean>} True jika berhasil
   */
  updatePassword: async (userId, newPassword) => {
    try {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(newPassword, salt);

      await db.query(
        'UPDATE user SET password = ? WHERE id = ?',
        [hashedPassword, userId]
      );

      return true;
    } catch (error) {
      console.error('Error in updatePassword:', error);
      throw error;
    }
  },

  /**
   * Mencari user berdasarkan ID
   * @param {number} id - ID user
   * @returns {Promise<object>} User object tanpa password
   */
  findById: async (id) => {
    try {
      const rows = await db.query(
        `SELECT * FROM 'destinasi' WHERE (nama, tempat, lokasi, gambar, deskripsi) VALUES (?,?,?,?,?)`,
        
      );
      console.log("test", rows)
    //   return rows[0] || null;
    } catch (error) {
      console.error('Error in findById:', error);
      throw error;
    }
  }
};

module.exports = Auth;
