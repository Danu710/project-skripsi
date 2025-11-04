// controllers/siswaController.js
import db from '../models/index.js';
const { Siswa, Jawaban, Nilai } = db;

export const createSiswa = async (req, res) => {
  try {
    const s = await Siswa.create(req.body);
    res.status(201).json(s);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getAllSiswa = async (req, res) => {
  try {
    const all = await Siswa.findAll({ include: [Jawaban, Nilai] });
    res.json(all);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getSiswaById = async (req, res) => {
  try {
    const s = await Siswa.findByPk(req.params.id, {
      include: [Jawaban, Nilai],
    });
    if (!s) return res.status(404).json({ message: 'Siswa not found' });
    res.json(s);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateSiswa = async (req, res) => {
  try {
    const s = await Siswa.findByPk(req.params.id);
    if (!s) return res.status(404).json({ message: 'Siswa not found' });
    await s.update(req.body);
    res.json(s);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteSiswa = async (req, res) => {
  try {
    const s = await Siswa.findByPk(req.params.id);
    if (!s) return res.status(404).json({ message: 'Siswa not found' });
    await s.destroy();
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
