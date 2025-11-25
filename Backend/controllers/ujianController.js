import db from '../models/index.js';
const { Ujian } = db;

export const createUjian = async (req, res) => {
  try {
    const { nama_ujian, tanggal_ujian, durasi, id_guru } = req.body;
    const ujian = await Ujian.create({
      nama_ujian,
      tanggal_ujian,
      durasi,
      id_guru,
    });
    res.status(201).json(ujian);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getAllUjian = async (req, res) => {
  try {
    const ujian = await Ujian.findAll();
    res.json(ujian);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getUjianById = async (req, res) => {
  try {
    const { id_ujian } = req.params;

    // Validasi ID
    if (!id_ujian || isNaN(id_ujian)) {
      return res.status(400).json({ message: 'id_ujian harus berupa number' });
    }

    const ujian = await Ujian.findByPk(id_ujian);

    if (!ujian) {
      return res.status(404).json({ message: 'Ujian tidak ditemukan' });
    }

    res.json(ujian);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
