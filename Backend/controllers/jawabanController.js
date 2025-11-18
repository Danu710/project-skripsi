// controllers/jawabanController.js
import db from '../models/index.js';
const { Jawaban, Siswa, Soal, Ujian } = db;

/* -------------------- CREATE -------------------- */
export const createJawaban = async (req, res) => {
  try {
    const { id_siswa, id_soal, id_ujian, jawaban_text } = req.body;

    if (!id_siswa || !id_soal || !id_ujian || !jawaban_text) {
      return res
        .status(400)
        .json({
          message: 'id_siswa, id_soal, id_ujian, dan jawaban_text wajib diisi',
        });
    }

    const newJawaban = await Jawaban.create({
      id_siswa,
      id_soal,
      id_ujian,
      jawaban_text,
    });

    res.status(201).json({
      message: 'Jawaban berhasil dibuat',
      data: newJawaban,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* -------------------- READ ALL -------------------- */
export const getAllJawaban = async (req, res) => {
  try {
    const all = await Jawaban.findAll({
      include: [
        {
          model: Siswa,
          attributes: ['id_siswa', 'nama_siswa', 'kelas', 'jurusan'],
        },
        { model: Soal, attributes: ['id_soal', 'pertanyaan'] },
        { model: Ujian, attributes: ['id_ujian', 'nama_ujian'] },
      ],
      order: [['id_jawaban', 'ASC']],
    });
    res.json(all);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* -------------------- READ BY ID -------------------- */
export const getJawabanById = async (req, res) => {
  try {
    const j = await Jawaban.findByPk(req.params.id, {
      include: [
        { model: Siswa, attributes: ['id_siswa', 'nama_siswa'] },
        { model: Soal, attributes: ['id_soal', 'pertanyaan'] },
        { model: Ujian, attributes: ['id_ujian', 'judul_ujian'] },
      ],
    });

    if (!j) return res.status(404).json({ message: 'Jawaban tidak ditemukan' });
    res.json(j);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* -------------------- UPDATE -------------------- */
export const updateJawaban = async (req, res) => {
  try {
    const j = await Jawaban.findByPk(req.params.id);
    if (!j) return res.status(404).json({ message: 'Jawaban tidak ditemukan' });

    await j.update(req.body);
    res.json({ message: 'Jawaban berhasil diperbarui', data: j });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* -------------------- DELETE -------------------- */
export const deleteJawaban = async (req, res) => {
  try {
    const j = await Jawaban.findByPk(req.params.id);
    if (!j) return res.status(404).json({ message: 'Jawaban tidak ditemukan' });

    await j.destroy();
    res.json({ message: 'Jawaban berhasil dihapus' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
