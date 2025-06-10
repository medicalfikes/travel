require('dotenv').config()
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const destinasiRoutes = require('./routes/destinasiRoutes');
const userRoutes = require('./routes/userRoutes'); // Tambahkan impor userRoutes
const { uploadDir } = require('./config/multerConfig');

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/uploads', express.static(uploadDir));

// Routes
app.use('/api/destinasi', destinasiRoutes);
app.use('/api/users', userRoutes); // Tambahkan user routes

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Terjadi kesalahan pada server',
    error: err.message
  });
});

// Health check endpoint yang lebih lengkap
app.get('/health', (req, res) => {
  const healthcheck = {
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memoryUsage: process.memoryUsage(),
    environment: process.env.NODE_ENV || 'development',
    uploadDir: uploadDir,
    activeRoutes: [
      '/api/destinasi',
      '/api/users'
    ]
  };
  res.status(200).json(healthcheck);
});

// Route untuk dokumentasi API
app.get('/api-docs', (req, res) => {
  res.sendFile(path.join(__dirname, 'api-docs.html'));
});

const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || '192.168.72.130';

app.listen(PORT, HOST, () => {
  console.log(`Server berjalan di http://${HOST}:${PORT}`);
  console.log('Routes yang tersedia:');
  console.log(`- Destinasi: http://${HOST}:${PORT}/api/destinasi`);
  console.log(`- Users: http://${HOST}:${PORT}/api/users`);
  console.log(`- Health check: http://${HOST}:${PORT}/health`);
  console.log(`- Upload directory: ${uploadDir}`);
});
