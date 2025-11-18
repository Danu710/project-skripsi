// controllers/nilaiController.js
import db from '../models/index.js';

const { Nilai, Siswa, Ujian } = db;

/* ============================================================
   CREATE NILAI
============================================================ */
export const createNilai = async (req, res) => {
  try {
    const { id_siswa, id_ujian, total_nilai, ranking } = req.body;

    const newNilai = await Nilai.create({
      id_siswa,
      id_ujian,
      total_nilai,
      ranking,
    });

    return res.status(201).json({
      message: '✅ Nilai berhasil dibuat',
      data: newNilai,
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

/* ============================================================
   GET ALL NILAI
============================================================ */
export const getAllNilai = async (req, res) => {
  try {
    const nilai = await Nilai.findAll({
      include: [
        {
          model: Siswa,
          attributes: ['id_siswa', 'nama_siswa', 'kelas'],
        },
        {
          model: Ujian,
          attributes: ['id_ujian', 'nama_ujian'],
        },
      ],
      order: [['id_nilai', 'ASC']],
    });

    return res.json({
      message: '📄 Daftar nilai berhasil diambil',
      data: nilai,
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

/* ============================================================
   GET NILAI BY ID
============================================================ */
export const getNilaiById = async (req, res) => {
  try {
    const nilai = await Nilai.findByPk(req.params.id, {
      include: [
        {
          model: Siswa,
          attributes: ['id_siswa', 'nama_siswa'],
        },
        {
          model: Ujian,
          attributes: ['id_ujian', 'nama_ujian'],
        },
      ],
    });

    if (!nilai) {
      return res.status(404).json({ message: '❌ Nilai tidak ditemukan' });
    }

    return res.json({
      message: '📌 Detail nilai berhasil diambil',
      data: nilai,
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

/* ============================================================
   UPDATE NILAI
============================================================ */
export const updateNilai = async (req, res) => {
  try {
    const nilai = await Nilai.findByPk(req.params.id);

    if (!nilai) {
      return res.status(404).json({ message: '❌ Nilai tidak ditemukan' });
    }

    await nilai.update(req.body);

    return res.json({
      message: '✅ Nilai berhasil diperbarui',
      data: nilai,
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

/* ============================================================
   DELETE NILAI
============================================================ */
export const deleteNilai = async (req, res) => {
  try {
    const nilai = await Nilai.findByPk(req.params.id);

    if (!nilai) {
      return res.status(404).json({ message: '❌ Nilai tidak ditemukan' });
    }

    await nilai.destroy();

    return res.json({
      message: '🗑️ Nilai berhasil dihapus',
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
