const mysql = require('mysql2');
require('dotenv').config();

/**
 * Konfigurasi Pool Database MySQL
 */
const pool = mysql.createPool({
  process.env.DATABASE_URL
  ssl: true                            
                              
  
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
    console.log(`   📊 Database: ${process.env.DATABASE_URL || 'travel'}`);
    // console.log(`   🏠 Host: ${process.env.DB_HOST || 'localhost'}:${process.env.DB_PORT || 3306}`);
    // console.log(`   🔐 SSL: ${process.env.DB_SSL === 'true' ? 'Aktif' : 'Nonaktif'}`);
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

// testConnection();

// Handle shutdown graceful
process.on('SIGINT', async () => {
  await pool.end();
  console.log('🛑 [Database] Koneksi ditutup');
  process.exit(0);
});

module.exports = pool;
