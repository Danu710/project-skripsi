import Subkriteria from '../models/subkriteria.js';
import Kriteria from '../models/kriteria.js';

// GET semua subkriteria
export const getAllSubkriteria = async (req, res) => {
  try {
    const data = await Subkriteria.findAll({
      include: [{ model: Kriteria, as: 'kriteria' }],
    });

    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET subkriteria by ID
export const getSubkriteriaById = async (req, res) => {
  try {
    const { id } = req.params;

    const data = await Subkriteria.findByPk(id, {
      include: [{ model: Kriteria, as: 'kriteria' }],
    });

    if (!data)
      return res
        .status(404)
        .json({ success: false, message: 'Subkriteria tidak ditemukan' });

    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// CREATE subkriteria
export const createSubkriteria = async (req, res) => {
  try {
    const { id_kriteria, nama_subkriteria, nilai } = req.body;

    const kriteria = await Kriteria.findByPk(id_kriteria);
    if (!kriteria)
      return res
        .status(404)
        .json({ success: false, message: 'ID Kriteria tidak ditemukan' });

    const data = await Subkriteria.create({
      id_kriteria,
      nama_subkriteria,
      nilai,
    });

    res.status(201).json({
      success: true,
      message: 'Subkriteria berhasil ditambahkan',
      data,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// UPDATE subkriteria
export const updateSubkriteria = async (req, res) => {
  try {
    const { id } = req.params;
    const { id_kriteria, nama_subkriteria, nilai } = req.body;

    const sub = await Subkriteria.findByPk(id);
    if (!sub)
      return res
        .status(404)
        .json({ success: false, message: 'Subkriteria tidak ditemukan' });

    if (id_kriteria) {
      const kriteria = await Kriteria.findByPk(id_kriteria);
      if (!kriteria)
        return res
          .status(404)
          .json({ success: false, message: 'ID Kriteria tidak valid' });
    }

    await sub.update({
      id_kriteria,
      nama_subkriteria,
      nilai,
    });

    res.json({
      success: true,
      message: 'Subkriteria berhasil diperbarui',
      data: sub,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// DELETE subkriteria
export const deleteSubkriteria = async (req, res) => {
  try {
    const { id } = req.params;

    const sub = await Subkriteria.findByPk(id);
    if (!sub)
      return res
        .status(404)
        .json({ success: false, message: 'Subkriteria tidak ditemukan' });

    await sub.destroy();

    res.json({
      success: true,
      message: 'Subkriteria berhasil dihapus',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
