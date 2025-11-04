// controllers/soalController.js
import db from '../models/index.js';
const { Soal, Ujian } = db;

export const getAllSoal = async (req, res) => {
  try {
    const soals = await Soal.findAll({
      include: [
        {
          model: Ujian,
          attributes: ['id_ujian', 'nama_ujian', 'tanggal_ujian', 'durasi'],
        },
      ],
    });
    res.status(200).json(soals);
  } catch (error) {
    console.error('❌ Error getAllSoal:', error);
    res.status(500).json({ message: 'Gagal mengambil data soal', error });
  }
};

export const getSoalById = async (req, res) => {
  try {
    const { id } = req.params;
    const soal = await Soal.findByPk(id, {
      include: [{ model: Ujian, attributes: ['id_ujian', 'nama_ujian'] }],
    });

    if (!soal) {
      return res.status(404).json({ message: 'Soal tidak ditemukan' });
    }

    res.status(200).json(soal);
  } catch (error) {
    console.error('❌ Error getSoalById:', error);
    res.status(500).json({ message: 'Gagal mengambil data soal', error });
  }
};

/* ============================================================
   POST Tambah Soal Baru
============================================================ */
export const createSoal = async (req, res) => {
  try {
    const {
      id_ujian,
      pertanyaan,
      opsi_a,
      opsi_b,
      opsi_c,
      opsi_d,
      jawaban_benar,
    } = req.body;

    if (
      !id_ujian ||
      !pertanyaan ||
      !opsi_a ||
      !opsi_b ||
      !opsi_c ||
      !opsi_d ||
      !jawaban_benar
    ) {
      return res.status(400).json({ message: 'Semua field wajib diisi' });
    }

    const newSoal = await Soal.create({
      id_ujian,
      pertanyaan,
      opsi_a,
      opsi_b,
      opsi_c,
      opsi_d,
      jawaban_benar,
    });

    res
      .status(201)
      .json({ message: 'Soal berhasil ditambahkan', data: newSoal });
  } catch (error) {
    console.error('❌ Error createSoal:', error);
    res.status(500).json({ message: 'Gagal menambah soal', error });
  }
};

export const updateSoal = async (req, res) => {
  try {
    const { id } = req.params;
    const soal = await Soal.findByPk(id);

    if (!soal) {
      return res.status(404).json({ message: 'Soal tidak ditemukan' });
    }

    await soal.update(req.body);
    res.status(200).json({ message: 'Soal berhasil diperbarui', data: soal });
  } catch (error) {
    console.error('❌ Error updateSoal:', error);
    res.status(500).json({ message: 'Gagal memperbarui soal', error });
  }
};

export const deleteSoal = async (req, res) => {
  try {
    const { id } = req.params;
    const soal = await Soal.findByPk(id);

    if (!soal) {
      return res.status(404).json({ message: 'Soal tidak ditemukan' });
    }

    await soal.destroy();
    res.status(200).json({ message: 'Soal berhasil dihapus' });
  } catch (error) {
    console.error('❌ Error deleteSoal:', error);
    res.status(500).json({ message: 'Gagal menghapus soal', error });
  }
};
