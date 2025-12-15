import db from '../models/index.js';
const { Siswa } = db;

export const mulaiUjian = async (req, res) => {
  const { id_siswa, id_ujian } = req.body;

  await Siswa.update(
    {
      sedang_ujian: true,
      id_ujian_aktif: id_ujian,
    },
    { where: { id_siswa } }
  );

  res.json({ message: 'Ujian dimulai' });
};

export const statusUjian = async (req, res) => {
  const siswa = await Siswa.findByPk(req.params.id);

  res.json({
    sedang_ujian: siswa.sedang_ujian,
    id_ujian_aktif: siswa.id_ujian_aktif,
  });
};

export const selesaiUjian = async (req, res) => {
  await Siswa.update(
    {
      sedang_ujian: false,
      id_ujian_aktif: null,
    },
    { where: { id_siswa: req.body.id_siswa } }
  );

  res.json({ message: 'Ujian selesai' });
};
