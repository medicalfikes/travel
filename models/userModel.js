const db = require('../config/db');

const User = {
  // Mendapatkan semua user (tanpa password)
  getAll: async () => {
    const [rows] = await db.query('SELECT id, nama, gmail, Alamat FROM user');
    return rows;
  },

  // Mendapatkan user by ID
  getById: async (id) => {
    const [rows] = await db.query('SELECT id, nama, gmail, Alamat FROM user WHERE id = ?', [id]);
    return rows[0];
  },

  // Membuat user baru
  create: async (userData) => {
    const { nama, gmail, Alamat, password } = userData;
    const [result] = await db.query(
      'INSERT INTO user (nama, gmail, Alamat, password) VALUES (?, ?, ?, ?)',
      [nama, gmail, Alamat, password]
    );
    return { id: result.insertId, nama, gmail, Alamat };
  },

  // Update user
  update: async (id, userData) => {
    const { nama, gmail, Alamat } = userData;
    await db.query(
      'UPDATE user SET nama = ?, gmail = ?, Alamat = ? WHERE id = ?',
      [nama, gmail, Alamat, id]
    );
    return { id, nama, gmail, Alamat };
  },

  // Delete user
  delete: async (id) => {
    await db.query('DELETE FROM user WHERE id = ?', [id]);
    return true;
  },

  // Cari user by email
  findByEmail: async (gmail) => {
    const [rows] = await db.query('SELECT * FROM user WHERE gmail = ?', [gmail]);
    return rows[0];
  }
};

module.exports = User;
