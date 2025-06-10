const Destinasi = require('../models/destinasiModel');
const path = require('path');
const fs = require('fs');
const { uploadDir } = require('../config/multerConfig');

const deleteFile = (filename) => {
  if (filename) {
    const filePath = path.join(uploadDir, filename);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  }
};

const destinasiController = {
  createDestinasi: async (req, res) => {
    try {
      const { nama, tempat, lokasi, deskripsi } = req.body;
      const gambar = req.file ? req.file.filename : null;

      // Validasi
      if (!nama?.trim()) {
        deleteFile(gambar);
        return res.status(400).json({ success: false, message: 'Nama destinasi harus diisi' });
      }
      if (!tempat?.trim()) {
        deleteFile(gambar);
        return res.status(400).json({ success: false, message: 'Tempat destinasi harus diisi' });
      }

      const id = await Destinasi.create({ 
        nama: nama.trim(), 
        tempat: tempat.trim(), 
        lokasi: lokasi?.trim(), 
        gambar, 
        deskripsi: deskripsi.trim() 
      });

      res.status(201).json({
        success: true,
        message: 'Destinasi berhasil dibuat',
        data: { 
          id,
          gambar: gambar ? `/uploads/${gambar}` : null
        }
      });
    } catch (err) {
      deleteFile(req.file?.filename);
      res.status(500).json({
        success: false,
        message: 'Gagal membuat destinasi',
        error: err.message
      });
    }
  },

  getAllDestinasi: async (req, res) => {
    try {
      const destinasi = await Destinasi.getAll();
      const result = destinasi.map(d => ({
        ...d,
        gambar: d.gambar ? `/uploads/${d.gambar}` : null
      }));

      res.json({
        success: true,
        message: result.length ? 'Data destinasi ditemukan' : 'Tidak ada data destinasi',
        count: result.length,
        data: result
      });
    } catch (err) {
      res.status(500).json({
        success: false,
        message: 'Gagal mengambil data destinasi',
        error: err.message
      });
    }
  },

  getDestinasiById: async (req, res) => {
    try {
      const destinasi = await Destinasi.getById(req.params.id);
      if (!destinasi) {
        return res.status(404).json({ 
          success: false, 
          message: 'Destinasi tidak ditemukan' 
        });
      }

      res.json({
        success: true,
        message: 'Destinasi ditemukan',
        data: {
          ...destinasi,
          gambar: destinasi.gambar ? `/uploads/${destinasi.gambar}` : null
        }
      });
    } catch (err) {
      res.status(500).json({
        success: false,
        message: 'Gagal mengambil data destinasi',
        error: err.message
      });
    }
  },

  updateDestinasi: async (req, res) => {
    try {
      const { id } = req.params;
      const { nama, tempat, lokasi, deskripsi, currentImage } = req.body;
      let gambar = currentImage?.replace('/uploads/', '');

      if (req.file) {
        gambar = req.file.filename;
        deleteFile(currentImage?.replace('/uploads/', ''));
      }

      // Validasi
      if (!nama?.trim()) {
        deleteFile(req.file?.filename);
        return res.status(400).json({ success: false, message: 'Nama destinasi harus diisi' });
      }

      const existing = await Destinasi.getById(id);
      if (!existing) {
        deleteFile(req.file?.filename);
        return res.status(404).json({ success: false, message: 'Destinasi tidak ditemukan' });
      }

      await Destinasi.update(id, { 
        nama: nama.trim(), 
        tempat: tempat.trim(), 
        lokasi: lokasi?.trim(), 
        gambar, 
        deskripsi: deskripsi.trim() 
      });

      res.json({
        success: true,
        message: 'Destinasi berhasil diperbarui',
        data: { 
          id,
          gambar: gambar ? `/uploads/${gambar}` : null
        }
      });
    } catch (err) {
      deleteFile(req.file?.filename);
      res.status(500).json({
        success: false,
        message: 'Gagal memperbarui destinasi',
        error: err.message
      });
    }
  },

  deleteDestinasi: async (req, res) => {
    try {
      const { id } = req.params;
      const destinasi = await Destinasi.getById(id);
      
      if (!destinasi) {
        return res.status(404).json({ 
          success: false, 
          message: 'Destinasi tidak ditemukan' 
        });
      }

      deleteFile(destinasi.gambar);
      await Destinasi.delete(id);

      res.json({
        success: true,
        message: 'Destinasi berhasil dihapus',
        data: { id }
      });
    } catch (err) {
      res.status(500).json({
        success: false,
        message: 'Gagal menghapus destinasi',
        error: err.message
      });
    }
  },

  searchDestinasi: async (req, res) => {
    try {
      const { keyword } = req.query;
      
      if (!keyword?.trim()) {
        return res.status(400).json({ 
          success: false, 
          message: 'Kata kunci pencarian harus diisi' 
        });
      }

      const destinasi = await Destinasi.search(keyword.trim());
      const result = destinasi.map(d => ({
        ...d,
        gambar: d.gambar ? `/uploads/${d.gambar}` : null
      }));

      res.json({
        success: true,
        message: result.length ? `Ditemukan ${result.length} destinasi` : 'Tidak ditemukan destinasi',
        count: result.length,
        data: result
      });
    } catch (err) {
      res.status(500).json({
        success: false,
        message: 'Gagal melakukan pencarian',
        error: err.message
      });
    }
  }
};

module.exports = destinasiController;
