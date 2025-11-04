// controllers/nilaiController.js
import db from '../models/index.js';
const { Nilai, Siswa, Ujian } = db;

// ➕ Tambah nilai baru
export const createNilai = async (req, res) => {
  try {
    const { id_siswa, id_ujian, total_nilai, ranking } = req.body;

    const newNilai = await Nilai.create({
      id_siswa,
      id_ujian,
      total_nilai,
      ranking,
    });

    res.status(201).json({
      message: '✅ Nilai berhasil dibuat',
      data: newNilai,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 📋 Ambil semua nilai
export const getAllNilai = async (req, res) => {
  try {
    const data = await Nilai.findAll({
      include: [
        { model: Siswa, attributes: ['id_siswa', 'nama_siswa', 'kelas'] },
        { model: Ujian, attributes: ['id_ujian', 'nama_ujian'] },
      ],
    });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 🔍 Ambil nilai berdasarkan ID
export const getNilaiById = async (req, res) => {
  try {
    const nilai = await Nilai.findByPk(req.params.id, {
      include: [
        { model: Siswa, attributes: ['id_siswa', 'nama_siswa'] },
        { model: Ujian, attributes: ['id_ujian', 'nama_ujian'] },
      ],
    });

    if (!nilai)
      return res.status(404).json({ message: 'Nilai tidak ditemukan' });

    res.json(nilai);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✏️ Update nilai
export const updateNilai = async (req, res) => {
  try {
    const nilai = await Nilai.findByPk(req.params.id);
    if (!nilai)
      return res.status(404).json({ message: 'Nilai tidak ditemukan' });

    await nilai.update(req.body);
    res.json({
      message: '✅ Nilai berhasil diperbarui',
      data: nilai,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ❌ Hapus nilai
export const deleteNilai = async (req, res) => {
  try {
    const nilai = await Nilai.findByPk(req.params.id);
    if (!nilai)
      return res.status(404).json({ message: 'Nilai tidak ditemukan' });

    await nilai.destroy();
    res.json({ message: '🗑️ Nilai berhasil dihapus' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
