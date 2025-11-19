// controllers/sawController.js
import db from '../models/index.js';

const { Siswa, Ujian, Jawaban, Nilai, Kriteria, Subkriteria, Soal } = db;

/* =====================================================
   1. PROSES SAW UNTUK SATU UJIAN
===================================================== */

import { Op } from 'sequelize';

// export const prosesSAW = async (req, res) => {
//   try {
//     const { id_ujian } = req.body;

//     if (!id_ujian) {
//       return res.status(400).json({ message: 'id_ujian wajib diisi' });
//     }

//     // ================================
//     // 1. Ambil semua jawaban dan soal terkait ujian
//     // ================================
//     const jawabanData = await Jawaban.findAll({
//       where: { id_ujian },
//       include: [
//         {
//           model: Soal,
//           include: [
//             {
//               model: Kriteria, // untuk Soal -> Kriteria
//             },
//           ],
//         },
//         { model: Siswa },
//       ],
//     });

//     if (!jawabanData.length) {
//       return res
//         .status(404)
//         .json({ message: 'Tidak ada jawaban untuk ujian ini' });
//     }

//     // ================================
//     // 2. Hitung nilai subkriteria per siswa per kriteria
//     // ================================
//     const siswaMap = {}; // { id_siswa: { C1: nilai, C2: nilai, ... } }

//     for (const jawaban of jawabanData) {
//       const { id_siswa, jawaban_text, Soal: soal, Siswa: siswaObj } = jawaban;
//       const kriteria = soal.Kriteria;
//       if (!kriteria) continue; // safety check
//       const kode = kriteria.kode; // C1, C2, ...

//       if (!siswaMap[id_siswa])
//         siswaMap[id_siswa] = {
//           id_siswa,
//           nama_siswa: siswaObj.nama_siswa,
//           nilai: {},
//         };

//       // cek jawaban benar atau salah
//       const benar = jawaban_text === soal.jawaban_benar ? 1 : 0;

//       if (!siswaMap[id_siswa].nilai[kode]) siswaMap[id_siswa].nilai[kode] = 0;
//       siswaMap[id_siswa].nilai[kode] += benar;
//     }

//     // ================================
//     // 3. Ambil subkriteria untuk semua kriteria
//     // ================================
//     const subkriteriaAll = await Subkriteria.findAll({
//       include: [{ model: Kriteria, as: 'kriteria' }], // pakai alias
//     });

//     // ================================
//     // 4. Tentukan subkriteria tiap siswa per kriteria
//     // ================================
//     for (const siswa of Object.values(siswaMap)) {
//       for (const [kode, totalBenar] of Object.entries(siswa.nilai)) {
//         const subList = subkriteriaAll.filter(
//           (sk) => sk.kriteria.kode === kode
//         );

//         const sub = subList
//           .sort((a, b) => b.nilai - a.nilai)
//           .find((sk) => {
//             if (kode === 'C4') {
//               // Cost
//               if (totalBenar <= 0 && sk.nama_subkriteria.includes('0'))
//                 return true;
//               if (totalBenar <= 2 && sk.nama_subkriteria.includes('1–2'))
//                 return true;
//               if (totalBenar > 2 && sk.nama_subkriteria.includes('>2'))
//                 return true;
//             } else {
//               // Benefit
//               const persen = (totalBenar / subList.length) * 100;
//               if (sk.nama_subkriteria.includes('90') && persen >= 90)
//                 return true;
//               if (sk.nama_subkriteria.includes('80') && persen >= 80)
//                 return true;
//               if (sk.nama_subkriteria.includes('70') && persen >= 70)
//                 return true;
//               if (sk.nama_subkriteria.includes('10') && persen >= 10)
//                 return true;
//             }
//             return false;
//           });

//         siswa.nilai[kode] = sub ? sub.nilai : 0;
//       }
//     }

//     // ================================
//     // 5. Normalisasi matriks keputusan
//     // ================================
//     const kriteriaAll = await Kriteria.findAll();
//     const maxPerKriteria = {};
//     for (const k of kriteriaAll) {
//       const kode = k.kode;
//       maxPerKriteria[kode] = Math.max(
//         ...Object.values(siswaMap).map((s) => s.nilai[kode] || 0)
//       );
//     }

//     // ================================
//     // 6. Hitung total nilai SAW per siswa
//     // ================================
//     for (const siswa of Object.values(siswaMap)) {
//       let totalNilai = 0;
//       const detail = {};
//       for (const k of kriteriaAll) {
//         const kode = k.kode;
//         const nilai = siswa.nilai[kode] || 0;
//         const normalisasi = maxPerKriteria[kode]
//           ? nilai / maxPerKriteria[kode]
//           : 0;
//         totalNilai += normalisasi * parseFloat(k.bobot);
//         detail[kode] = normalisasi;
//       }
//       siswa.detail_nilai = detail;
//       siswa.total_nilai = totalNilai;
//     }

//     // ================================
//     // 7. Ranking siswa
//     // ================================
//     const sortedSiswa = Object.values(siswaMap).sort(
//       (a, b) => b.total_nilai - a.total_nilai
//     );
//     sortedSiswa.forEach((s, i) => (s.ranking = i + 1));

//     // ================================
//     // 8. Simpan ke  DB tabel Nilai
//     // ================================
//     for (const s of sortedSiswa) {
//       await Nilai.upsert({
//         id_siswa: s.id_siswa,
//         id_ujian,
//         total_nilai: s.total_nilai,
//         detail_nilai: s.detail_nilai,
//         ranking: s.ranking,
//       });
//     }

//     return res.status(200).json({
//       message: 'Perhitungan SAW selesai',
//       data: sortedSiswa,
//     });
//   } catch (error) {
//     console.error('❌ Error prosesSAW:', error);
//     return res.status(500).json({ message: 'Gagal menghitung SAW', error });
//   }
// };

// export const prosesSAW = async (req, res) => {
//   console.log('🚀 Memulai proses SAW...');

//   try {
//     const { id_ujian } = req.body;
//     console.log('📌 id_ujian diterima:', id_ujian);

//     if (!id_ujian) {
//       console.log('❌ id_ujian tidak diberikan');
//       return res.status(400).json({ message: 'id_ujian wajib diisi' });
//     }

//     // 1️⃣ Ambil semua jawaban dan soal terkait ujian
//     console.log('📌 Mengambil data jawaban dan soal...');
//     const jawabanData = await Jawaban.findAll({
//       where: { id_ujian },
//       include: [
//         {
//           model: Soal,
//           include: [
//             Kriteria,
//             Subkriteria, // subkriteria otomatis include Kriteria kalau dibutuhkan nanti
//           ],
//         },
//         Siswa,
//       ],
//     });
//     console.log(`✅ Jumlah jawaban ditemukan: ${jawabanData.length}`);

//     if (!jawabanData.length) {
//       console.log('❌ Tidak ada jawaban untuk ujian ini');
//       return res
//         .status(404)
//         .json({ message: 'Tidak ada jawaban untuk ujian ini' });
//     }

//     // 2️⃣ Hitung nilai subkriteria per siswa per kriteria
//     console.log('📌 Menghitung nilai subkriteria per siswa...');
//     const siswaMap = {};

//     for (const jawaban of jawabanData) {
//       const { id_siswa, jawaban_text, Soal: soal } = jawaban;
//       const kriteria = soal.kriteria;
//       console.log('DEBUG Soal:', soal.id_soal, 'kriteria =', soal.id_kriteria);

//       if (!kriteria) {
//         console.log(`⚠️ Soal ${soal.id_soal} tidak memiliki kriteria`);
//         continue;
//       }
//       const kode = kriteria.kode;

//       if (!siswaMap[id_siswa]) {
//         siswaMap[id_siswa] = {
//           id_siswa,
//           nama_siswa: jawaban.Siswa.nama,
//           nilai: {},
//         };
//       }

//       const benar = jawaban_text === soal.jawaban_benar ? 1 : 0;
//       if (!siswaMap[id_siswa].nilai[kode]) siswaMap[id_siswa].nilai[kode] = 0;
//       siswaMap[id_siswa].nilai[kode] += benar;
//     }
//     console.log('✅ Nilai per siswa berhasil dihitung');
//     console.log('siswaMap:', siswaMap);

//     // 3️⃣ Ambil subkriteria untuk semua kriteria
//     console.log('📌 Mengambil semua subkriteria...');
//     const subkriteriaAll = await Subkriteria.findAll({
//       include: [{ model: Kriteria }],
//     });
//     console.log(`✅ Jumlah subkriteria ditemukan: ${subkriteriaAll.length}`);

//     // 4️⃣ Tentukan subkriteria tiap siswa per kriteria
//     console.log('📌 Menentukan subkriteria tiap siswa...');
//     for (const siswa of Object.values(siswaMap)) {
//       for (const [kode, totalBenar] of Object.entries(siswa.nilai)) {
//         const subList = subkriteriaAll.filter(
//           (sk) => sk.kriteria.kode === kode
//         );
//         const sub = subList
//           .sort((a, b) => b.nilai - a.nilai)
//           .find((sk) => {
//             if (kode === 'C4') {
//               if (totalBenar <= 0 && sk.nama_subkriteria.includes('0'))
//                 return true;
//               if (totalBenar <= 2 && sk.nama_subkriteria.includes('1–2'))
//                 return true;
//               if (totalBenar > 2 && sk.nama_subkriteria.includes('>2'))
//                 return true;
//             } else {
//               const persen = (totalBenar / subList.length) * 100;
//               if (sk.nama_subkriteria.includes('90') && persen >= 90)
//                 return true;
//               if (sk.nama_subkriteria.includes('80') && persen >= 80)
//                 return true;
//               if (sk.nama_subkriteria.includes('70') && persen >= 70)
//                 return true;
//               if (sk.nama_subkriteria.includes('10') && persen >= 10)
//                 return true;
//             }
//             return false;
//           });
//         siswa.nilai[kode] = sub ? sub.nilai : 0;
//       }
//     }
//     console.log('✅ Subkriteria siswa berhasil ditentukan');

//     // 5️⃣ Normalisasi matriks keputusan
//     console.log('📌 Melakukan normalisasi matriks keputusan...');
//     const kriteriaAll = await Kriteria.findAll();
//     const maxPerKriteria = {};
//     for (const k of kriteriaAll) {
//       const kode = k.kode;
//       maxPerKriteria[kode] = Math.max(
//         ...Object.values(siswaMap).map((s) => s.nilai[kode] || 0)
//       );
//     }
//     console.log('✅ Normalisasi berhasil, maxPerKriteria:', maxPerKriteria);

//     // 6️⃣ Hitung total nilai SAW & buat detail_nilai
//     console.log('📌 Menghitung total nilai SAW dan detail nilai...');
//     for (const siswa of Object.values(siswaMap)) {
//       let totalNilai = 0;
//       const detail = {};
//       for (const k of kriteriaAll) {
//         const kode = k.kode;
//         const nilai = siswa.nilai[kode] || 0;
//         const normalisasi = maxPerKriteria[kode]
//           ? nilai / maxPerKriteria[kode]
//           : 0;
//         totalNilai += normalisasi * parseFloat(k.bobot);
//         detail[kode] = parseFloat(normalisasi.toFixed(4));
//       }
//       siswa.total_nilai = parseFloat(totalNilai.toFixed(4));
//       siswa.detail_nilai = detail;
//       console.log('====================');
//       console.log('Siswa:', siswa.nama_siswa);
//       console.log('Detail Nilai:', detail);
//       console.log('Total Nilai SAW:', siswa.total_nilai);
//       console.log('====================\n');
//     }

//     // 7️⃣ Ranking siswa
//     console.log('📌 Menentukan ranking siswa...');
//     const sortedSiswa = Object.values(siswaMap).sort(
//       (a, b) => b.total_nilai - a.total_nilai
//     );
//     sortedSiswa.forEach((s, i) => (s.ranking = i + 1));
//     console.log('✅ Ranking selesai');

//     // 8️⃣ Simpan ke tabel Nilai
//     console.log('📌 Menyimpan data ke tabel Nilai...');
//     for (const s of sortedSiswa) {
//       await Nilai.upsert({
//         id_siswa: s.id_siswa,
//         id_ujian,
//         total_nilai: s.total_nilai,
//         detail_nilai: s.detail_nilai,
//         ranking: s.ranking,
//       });
//       console.log(`💾 Nilai siswa ${s.nama_siswa} disimpan`);
//     }

//     console.log('🎉 Perhitungan SAW selesai');

//     return res.status(200).json({
//       message: 'Perhitungan SAW selesai',
//       data: sortedSiswa,
//     });
//   } catch (error) {
//     console.error('❌ Error prosesSAW:', error);
//     return res.status(500).json({ message: 'Gagal menghitung SAW', error });
//   }
// };

export const prosesSAW = async (req, res) => {
  console.log('🚀 Mulai proses SAW...');

  try {
    const { id_ujian } = req.body;
    if (!id_ujian)
      return res.status(400).json({ message: 'id_ujian wajib diisi' });

    // 1️⃣ Ambil semua jawaban + soal + subkriteria + kriteria + siswa
    const jawabanData = await Jawaban.findAll({
      where: { id_ujian },
      include: [
        {
          model: Soal,
          include: [{ model: Subkriteria, include: [Kriteria] }, Kriteria],
        },
        Siswa,
      ],
    });

    if (!jawabanData.length)
      return res.status(404).json({ message: 'Tidak ada jawaban' });

    // Struktur nilai siswa
    const siswaMap = {};

    // 2️⃣ Kumpulkan nilai mentah subkriteria per siswa
    for (const j of jawabanData) {
      const { id_siswa, jawaban_text, Siswa: siswa, Soal: soal } = j;

      if (!siswaMap[id_siswa]) {
        siswaMap[id_siswa] = {
          id_siswa,
          nama_siswa: siswa.nama,
          nilai: {}, // per kriteria
        };
      }

      // Jika jawaban benar → ambil nilai_subkriteria dari soal
      const nilaiSub =
        jawaban_text === soal.jawaban_benar ? soal.Subkriterium.nilai : 0;

      const kode = soal.Kriterium.kode;

      if (!siswaMap[id_siswa].nilai[kode]) siswaMap[id_siswa].nilai[kode] = 0;

      siswaMap[id_siswa].nilai[kode] += nilaiSub;
    }

    // 3️⃣ Ambil semua kriteria (dibutuhkan untuk bobot)
    const kriteriaAll = await Kriteria.findAll();

    // 4️⃣ Hitung nilai max untuk normalisasi
    const maxPerKriteria = {};
    for (const k of kriteriaAll) {
      const kode = k.kode;
      maxPerKriteria[kode] = Math.max(
        ...Object.values(siswaMap).map((s) => s.nilai[kode] || 0)
      );
    }

    // 5️⃣ Hitung nilai total SAW per siswa
    const result = [];
    for (const s of Object.values(siswaMap)) {
      let total = 0;
      const detail = {};

      for (const k of kriteriaAll) {
        const kode = k.kode;
        const bobot = parseFloat(k.bobot);
        const nilai = s.nilai[kode] || 0;
        const max = maxPerKriteria[kode] || 1;

        // Normalisasi SAW
        const norm = nilai / max;

        detail[kode] = parseFloat(norm.toFixed(4));
        total += norm * bobot;
      }

      result.push({
        ...s,
        detail_nilai: detail,
        total_nilai: parseFloat(total.toFixed(4)),
      });
    }

    // 6️⃣ Ranking
    result.sort((a, b) => b.total_nilai - a.total_nilai);
    result.forEach((s, i) => (s.ranking = i + 1));

    // 7️⃣ Simpan
    for (const s of result) {
      await Nilai.upsert({
        id_siswa: s.id_siswa,
        id_ujian,
        total_nilai: s.total_nilai,
        detail_nilai: s.detail_nilai,
        ranking: s.ranking,
      });
    }

    return res.status(200).json({
      message: 'Perhitungan SAW selesai',
      data: result,
    });
  } catch (error) {
    console.error('❌ Error prosesSAW:', error);
    return res.status(500).json({ message: 'Gagal menghitung SAW', error });
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
