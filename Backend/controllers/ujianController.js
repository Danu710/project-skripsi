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
