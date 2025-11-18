// controllers/siswaController.js
import db from '../models/index.js';
const { Siswa, Jawaban, Nilai } = db;

export const createSiswa = async (req, res) => {
  try {
    const { nama_siswa, username, password, kelas, jurusan } = req.body;

    if (!nama_siswa || !username || !password) {
      return res
        .status(400)
        .json({ message: 'nama_siswa, username, dan password wajib diisi' });
    }

    const s = await Siswa.create({
      nama_siswa,
      username,
      password,
      kelas,
      jurusan,
    });
    res.status(201).json({ message: 'Siswa berhasil dibuat', data: s });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getAllSiswa = async (req, res) => {
  try {
    const all = await Siswa.findAll();

    res.json(all);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getSiswaById = async (req, res) => {
  try {
    const s = await Siswa.findByPk(req.params.id, {
      include: [{ model: Jawaban }, { model: Nilai }],
    });

    if (!s) return res.status(404).json({ message: 'Siswa tidak ditemukan' });
    res.json(s);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateSiswa = async (req, res) => {
  try {
    const s = await Siswa.findByPk(req.params.id);
    if (!s) return res.status(404).json({ message: 'Siswa tidak ditemukan' });

    await s.update(req.body);
    res.json(s);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteSiswa = async (req, res) => {
  try {
    const s = await Siswa.findByPk(req.params.id);
    if (!s) return res.status(404).json({ message: 'Siswa tidak ditemukan' });

    await s.destroy();
    res.json({ message: 'Siswa berhasil dihapus' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
