import Kriteria from '../models/kriteria.js';

export const getAllKriteria = async (req, res) => {
  try {
    const data = await Kriteria.findAll();
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getKriteriaById = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await Kriteria.findByPk(id);

    if (!data)
      return res
        .status(404)
        .json({ success: false, message: 'Kriteria tidak ditemukan' });

    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createKriteria = async (req, res) => {
  try {
    const { kode, nama_kriteria, tipe, bobot } = req.body;

    const data = await Kriteria.create({ kode, nama_kriteria, tipe, bobot });

    res.status(201).json({
      success: true,
      message: 'Kriteria berhasil ditambahkan',
      data,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateKriteria = async (req, res) => {
  try {
    const { id } = req.params;
    const { kode, nama_kriteria, tipe, bobot } = req.body;

    const kriteria = await Kriteria.findByPk(id);
    if (!kriteria)
      return res
        .status(404)
        .json({ success: false, message: 'Kriteria tidak ditemukan' });

    await kriteria.update({ kode, nama_kriteria, tipe, bobot });

    res.json({
      success: true,
      message: 'Kriteria berhasil diperbarui',
      data: kriteria,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteKriteria = async (req, res) => {
  try {
    const { id } = req.params;

    const kriteria = await Kriteria.findByPk(id);
    if (!kriteria)
      return res
        .status(404)
        .json({ success: false, message: 'Kriteria tidak ditemukan' });

    await kriteria.destroy();

    res.json({ success: true, message: 'Kriteria berhasil dihapus' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
