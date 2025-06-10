const db = require('../config/db');

class Destinasi {
  // Create
  static async create({ nama, tempat, lokasi, gambar, deskripsi }) {
    const sql = 'INSERT INTO destinasi (nama, tempat, lokasi, gambar, deskripsi) VALUES (?, ?, ?, ?, ?)';
    const [result] = await db.execute(sql, [nama, tempat, lokasi, gambar, deskripsi]);
    return result.insertId;
  }

  // Read all
  static async getAll() {
    const [rows] = await db.execute('SELECT * FROM destinasi ORDER BY id DESC');
    return rows;
  }

  // Read by ID
  static async getById(id) {
    const [rows] = await db.execute('SELECT * FROM destinasi WHERE id = ?', [id]);
    return rows[0] || null;
  }

  // Update
  static async update(id, { nama, tempat, lokasi, gambar, deskripsi }) {
    const sql = 'UPDATE destinasi SET nama = ?, tempat = ?, lokasi = ?, gambar = ?, deskripsi = ? WHERE id = ?';
    await db.execute(sql, [nama, tempat, lokasi, gambar, deskripsi, id]);
    return true;
  }

  // Delete
  static async delete(id) {
    await db.execute('DELETE FROM destinasi WHERE id = ?', [id]);
    return true;
  }

  // Search
  static async search(keyword) {
    const [rows] = await db.execute(
      'SELECT * FROM destinasi WHERE nama LIKE ? OR tempat LIKE ? OR lokasi LIKE ?',
      [`%${keyword}%`, `%${keyword}%`, `%${keyword}%`]
    );
    return rows;
  }
}

module.exports = Destinasi;
