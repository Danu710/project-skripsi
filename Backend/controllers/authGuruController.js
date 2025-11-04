// controllers/authGuruController.js
import db from '../models/index.js';
const { Guru } = db;

export const loginGuru = async (req, res) => {
  try {
    const { username, password } = req.body;

    const guru = await Guru.findOne({ where: { username } });
    if (!guru) return res.status(404).json({ message: 'Guru tidak ditemukan' });

    if (guru.password !== password)
      return res.status(401).json({ message: 'Password salah' });

    res.json({
      message: 'Login guru berhasil',
      user: {
        id: guru.id_guru,
        nama: guru.nama_guru,
        role: 'guru',
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
