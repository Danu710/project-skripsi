import fs from 'fs';
import path from 'path';
import db from '../models/index.js';
const { Materi, Siswa } = db;

export const createMateri = async (req, res) => {
  try {
    const { judul_materi, deskripsi, id_guru } = req.body;

    if (!judul_materi || !id_guru) {
      return res
        .status(400)
        .json({ message: 'judul_materi dan id_guru wajib diisi' });
    }

    const file_materi = req.file ? req.file.filename : null;

    const materi = await Materi.create({
      judul_materi,
      deskripsi,
      file_materi,
      id_guru,
    });

    res.status(201).json(materi);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getAllMateri = async (req, res) => {
  try {
    const materi = await Materi.findAll();
    res.json(materi);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getMateriSiswa = async (req, res) => {
  try {
    const { id_siswa } = req.params;

    const siswa = await Siswa.findByPk(id_siswa);

    if (!siswa) {
      return res.status(404).json({ message: 'Siswa tidak ditemukan' });
    }

    if (siswa.sedang_ujian) {
      return res.status(403).json({
        message: 'Materi tidak dapat diakses saat ujian berlangsung',
      });
    }

    const materi = await Materi.findAll();
    res.json(materi);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getMateriById = async (req, res) => {
  try {
    const { id } = req.params;

    const materi = await Materi.findByPk(id);

    if (!materi) {
      return res.status(404).json({ message: 'Materi tidak ditemukan' });
    }

    res.json(materi);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteMateri = async (req, res) => {
  try {
    const { id } = req.params;

    const materi = await Materi.findByPk(id);

    if (!materi) {
      return res.status(404).json({ message: 'Materi tidak ditemukan' });
    }

    await materi.destroy();

    res.json({ message: 'Materi berhasil dihapus' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateMateri = async (req, res) => {
  try {
    const { id } = req.params;
    const { judul_materi, deskripsi, id_guru } = req.body;

    const materi = await Materi.findByPk(id);

    if (!materi) {
      return res.status(404).json({ message: 'Materi tidak ditemukan' });
    }

    // Jika upload file baru
    let file_materi = materi.file_materi;

    if (req.file) {
      // Hapus file lama jika ada
      if (file_materi) {
        const oldPath = path.join('uploads/materi', file_materi);
        if (fs.existsSync(oldPath)) {
          fs.unlinkSync(oldPath);
        }
      }

      file_materi = req.file.filename; // replace with new file
    }

    await materi.update({
      judul_materi: judul_materi || materi.judul_materi,
      deskripsi: deskripsi || materi.deskripsi,
      id_guru: id_guru || materi.id_guru,
      file_materi,
    });

    res.json({ message: 'Materi berhasil diupdate', materi });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
