// controllers/guruController.js
import db from '../models/index.js';
const { Guru, Materi, Ujian } = db;

export const createGuru = async (req, res) => {
  try {
    const g = await Guru.create(req.body);
    res.status(201).json(g);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getAllGuru = async (req, res) => {
  try {
    const all = await Guru.findAll({ include: [Materi, Ujian] });
    res.json(all);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getGuruById = async (req, res) => {
  try {
    const g = await Guru.findByPk(req.params.id, { include: [Materi, Ujian] });
    if (!g) return res.status(404).json({ message: 'Guru not found' });
    res.json(g);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateGuru = async (req, res) => {
  try {
    const g = await Guru.findByPk(req.params.id);
    if (!g) return res.status(404).json({ message: 'Guru not found' });
    await g.update(req.body);
    res.json(g);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteGuru = async (req, res) => {
  try {
    const g = await Guru.findByPk(req.params.id);
    if (!g) return res.status(404).json({ message: 'Guru not found' });
    await g.destroy();
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
