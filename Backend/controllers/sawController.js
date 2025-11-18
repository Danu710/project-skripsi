// controllers/sawController.js
import db from '../models/index.js';

const { Siswa, Ujian, Jawaban, Nilai, Kriteria, Subkriteria, Soal } = db;

/* =====================================================
   1. PROSES SAW UNTUK SATU UJIAN
===================================================== */
// export const prosesSAW = async (req, res) => {
//   try {
//     const { id_ujian } = req.body;

//     // 1. Ambil kriteria
//     const kriteria = await Kriteria.findAll({
//       include: [{ model: Subkriteria }],
//       order: [['id_kriteria', 'ASC']],
//     });

//     if (kriteria.length === 0) {
//       return res.status(400).json({ message: 'Kriteria belum dibuat' });
//     }

//     // 2. Ambil semua siswa yang mengerjakan ujian ini
//     const jawabanSiswa = await Jawaban.findAll({
//       where: { id_ujian },
//       include: [
//         { model: Siswa, attributes: ['id_siswa', 'nama_siswa'] },
//         { model: Ujian, attributes: ['id_ujian'] },
//       ],
//     });

//     if (jawabanSiswa.length === 0) {
//       return res
//         .status(400)
//         .json({ message: 'Tidak ada siswa yang mengerjakan ujian' });
//     }

//     // Kelompokkan jawaban berdasarkan siswa
//     const nilaiMatrix = {}; // { id_siswa: { C1: value, C2: value, ... } }

//     jawabanSiswa.forEach((jwb) => {
//       const id_siswa = jwb.id_siswa;

//       if (!nilaiMatrix[id_siswa]) {
//         nilaiMatrix[id_siswa] = {};
//       }

//       // Mapping nilai jawaban → Subkriteria (contoh: nilai benar = 1, salah = 0)
//       // Kamu bisa sesuaikan logika konversinya
//       const score = jwb.is_benar ? 1 : 0;

//       const id_kriteria = jwb.Soal?.id_kriteria;
//       if (id_kriteria) {
//         nilaiMatrix[id_siswa][id_kriteria] =
//           (nilaiMatrix[id_siswa][id_kriteria] || 0) + score;
//       }
//     });

//     // 3. Normalisasi Matriks
//     const normalisasiMatrix = {};
//     kriteria.forEach((k) => {
//       const id_kriteria = k.id_kriteria;
//       const values = Object.values(nilaiMatrix).map((m) => m[id_kriteria] || 0);

//       const max = Math.max(...values);
//       const min = Math.min(...values);

//       for (const id_siswa in nilaiMatrix) {
//         const nilai = nilaiMatrix[id_siswa][id_kriteria] || 0;

//         if (!normalisasiMatrix[id_siswa]) normalisasiMatrix[id_siswa] = {};

//         normalisasiMatrix[id_siswa][id_kriteria] =
//           k.tipe === 'benefit'
//             ? max === 0
//               ? 0
//               : nilai / max // benefit
//             : nilai === 0
//             ? 0
//             : min / nilai; // cost
//       }
//     });

//     // 4. Hitung total nilai SAW
//     const hasilAkhir = [];

//     for (const id_siswa in normalisasiMatrix) {
//       let total = 0;

//       kriteria.forEach((k) => {
//         const normVal = normalisasiMatrix[id_siswa][k.id_kriteria] || 0;
//         total += normVal * k.bobot;
//       });

//       hasilAkhir.push({
//         id_siswa,
//         total_nilai: parseFloat(total.toFixed(4)),
//       });
//     }

//     // 5. Urutkan ranking
//     hasilAkhir.sort((a, b) => b.total_nilai - a.total_nilai);

//     hasilAkhir.forEach((item, index) => {
//       item.ranking = index + 1;
//     });

//     // 6. Simpan ke tabel nilai
//     await Nilai.destroy({ where: { id_ujian } });

//     for (const item of hasilAkhir) {
//       await Nilai.create({
//         id_siswa: item.id_siswa,
//         id_ujian,
//         total_nilai: item.total_nilai,
//         ranking: item.ranking,
//       });
//     }

//     res.json({
//       message: 'Perhitungan SAW berhasil',
//       hasil: hasilAkhir,
//     });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: err.message });
//   }
// };

export const prosesSAW = async (req, res) => {
  try {
    const { id_ujian } = req.body;

    // 1. Ambil semua kriteria beserta bobot
    const kriteria = await Kriteria.findAll({
      order: [['id_kriteria', 'ASC']],
    });

    if (!kriteria.length)
      return res.status(400).json({ message: 'Kriteria belum dibuat' });

    // 2. Ambil semua jawaban siswa beserta Soal dan jawaban_benar
    const jawabanSiswa = await Jawaban.findAll({
      where: { id_ujian },
      include: [
        { model: Siswa, attributes: ['id_siswa', 'nama_siswa'] },
        {
          model: Soal,
          attributes: ['id_soal', 'id_kriteria', 'jawaban_benar'],
        },
      ],
    });

    if (!jawabanSiswa.length)
      return res.status(400).json({ message: 'Tidak ada jawaban siswa' });

    // 3. Hitung total nilai per siswa (Simple Additive Weighting)
    const totalNilaiPerSiswa = {}; // { id_siswa: total_nilai }

    jawabanSiswa.forEach((jwb) => {
      const id_siswa = jwb.id_siswa;
      const id_kriteria = jwb.Soal?.id_kriteria;
      const jawabanBenar = jwb.Soal?.jawaban_benar;

      if (!id_kriteria || !jawabanBenar) return; // skip jika data tidak lengkap

      const k = kriteria.find((k) => k.id_kriteria === id_kriteria);
      if (!k) return;

      if (!totalNilaiPerSiswa[id_siswa]) totalNilaiPerSiswa[id_siswa] = 0;

      // Tambahkan bobot jika jawaban benar, 0 jika salah
      totalNilaiPerSiswa[id_siswa] +=
        jwb.jawaban_text === jawabanBenar ? k.bobot : 0;
    });

    // 4. Buat array hasil dan ranking
    const hasilAkhir = Object.entries(totalNilaiPerSiswa)
      .map(([id_siswa, total_nilai]) => ({
        id_siswa: parseInt(id_siswa),
        total_nilai,
      }))
      .sort((a, b) => b.total_nilai - a.total_nilai);

    hasilAkhir.forEach((item, idx) => (item.ranking = idx + 1));

    // 5. Simpan ke tabel Nilai
    await Nilai.destroy({ where: { id_ujian } }); // reset nilai lama

    for (const item of hasilAkhir) {
      await Nilai.create({
        id_siswa: item.id_siswa,
        id_ujian,
        total_nilai: item.total_nilai,
        ranking: item.ranking,
      });
    }

    res.json({ message: 'Perhitungan SAW berhasil', hasil: hasilAkhir });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

/* =====================================================
   2. GET HASIL SAW UNTUK SATU UJIAN
===================================================== */
export const getHasilSAW = async (req, res) => {
  try {
    const { id_ujian } = req.params;

    const data = await Nilai.findAll({
      where: { id_ujian },
      include: [{ model: Siswa, attributes: ['nama_siswa'] }],
      order: [['ranking', 'ASC']],
    });

    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* =====================================================
   3. RESET HASIL SAW
===================================================== */
export const resetSAW = async (req, res) => {
  try {
    const { id_ujian } = req.params;

    await Nilai.destroy({ where: { id_ujian } });

    res.json({ message: 'HASIL SAW berhasil direset 🎯' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
