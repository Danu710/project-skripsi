import db from '../models/index.js';
const { Materi } = db;

export const createMateri = async (req, res) => {
  try {
    const { judul_materi, deskripsi, file_materi, id_guru } = req.body;

    if (!judul_materi || !id_guru) {
      return res
        .status(400)
        .json({ message: 'judul_materi dan id_guru wajib diisi' });
    }

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
