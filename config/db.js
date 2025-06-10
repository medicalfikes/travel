const mysql = require('mysql2/promise');
require('dotenv').config();

/**
 * Konfigurasi Pool Database MySQL
 */
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'travel',
  port: parseInt(process.env.DB_PORT) || 3306,
  waitForConnections: true,
  connectionLimit: parseInt(process.env.DB_CONNECTION_LIMIT) || 10,
  queueLimit: parseInt(process.env.DB_QUEUE_LIMIT) || 0,
  timezone: '+07:00', // Zona waktu Indonesia
  charset: 'utf8mb4', // Support emoji dan karakter khusus
  ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : null
});

/**
 * Uji Koneksi Database
 */
const testConnection = async () => {
  let connection;
  try {
    connection = await pool.getConnection();
    await connection.ping(); // Test respons database
    console.log('✅ [Database] Berhasil terhubung ke MySQL');
    console.log(`   📊 Database: ${process.env.DB_NAME || 'travel'}`);
    console.log(`   🏠 Host: ${process.env.DB_HOST || 'localhost'}:${process.env.DB_PORT || 3306}`);
    console.log(`   🔐 SSL: ${process.env.DB_SSL === 'true' ? 'Aktif' : 'Nonaktif'}`);
  } catch (err) {
    console.error('❌ [Database] Gagal terhubung:', err.message);
    console.error('   🔧 Solusi:');
    console.error('      - Periksa koneksi jaringan');
    console.error('      - Verifikasi credential database');
    console.error('      - Pastikan MySQL service berjalan');
    process.exit(1);
  } finally {
    if (connection) connection.release();
  }
};

testConnection();

// Handle shutdown graceful
process.on('SIGINT', async () => {
  await pool.end();
  console.log('🛑 [Database] Koneksi ditutup');
  process.exit(0);
});

module.exports = pool;
