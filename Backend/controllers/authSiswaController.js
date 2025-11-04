// controllers/authSiswaController.js
import db from '../models/index.js';
const { Siswa } = db;

export const loginSiswa = async (req, res) => {
  try {
    const { username, password } = req.body;

    const siswa = await Siswa.findOne({ where: { username } });
    if (!siswa)
      return res.status(404).json({ message: 'Siswa tidak ditemukan' });

    if (siswa.password !== password)
      return res.status(401).json({ message: 'Password salah' });

    res.json({
      message: 'Login siswa berhasil',
      user: {
        id: siswa.id_siswa,
        nama: siswa.nama_siswa,
        role: 'siswa',
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
