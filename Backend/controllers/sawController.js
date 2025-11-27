// controllers/sawController.js
import db from '../models/index.js';

const { Siswa, Ujian, Jawaban, Nilai, Kriteria, Subkriteria, Soal, HasilSaw } =
  db;

//proses hitung nilai siswa sebelum SAW
export async function hitungNilaiSiswa(req, res) {
  try {
    const id_ujian = Number(req.body.id_ujian || req.params.id_ujian);

    if (!id_ujian || isNaN(id_ujian)) {
      return res.status(400).json({ message: 'id_ujian harus berupa number' });
    }

    // === Ambil semua data ===
    const jawabanData = await Jawaban.findAll({
      where: { id_ujian },
      include: [{ model: Soal }, { model: Siswa }],
    });

    const subkriteriaData = await Subkriteria.findAll({ include: [Kriteria] });
    const kriteriaList = await Kriteria.findAll();

    const siswaMap = {};

    // ===============================================
    // 1) KUMPULKAN JUMLAH BENAR PER KRITERIA
    // ===============================================
    for (const j of jawabanData) {
      if (!j.Siswa || !j.Soal) continue;

      const siswaId = j.Siswa.id_siswa;
      const kriteriaId = j.Soal.id_kriteria;

      if (!siswaMap[siswaId]) {
        siswaMap[siswaId] = {
          id_siswa: siswaId,
          nama_siswa: j.Siswa.nama_siswa,
          nilaiSoal: {},
          nilai: {},
        };
      }

      if (!siswaMap[siswaId].nilaiSoal[kriteriaId]) {
        siswaMap[siswaId].nilaiSoal[kriteriaId] = {
          benar: 0,
          total: 0,
        };
      }

      const jawabanSiswa = (j.jawaban_text || '').trim().toLowerCase();
      const jawabanBenar = (j.Soal.jawaban_benar || '').trim().toLowerCase();

      // tambahkan total soal
      siswaMap[siswaId].nilaiSoal[kriteriaId].total += 1;

      // cek benar
      if (jawabanSiswa === jawabanBenar) {
        siswaMap[siswaId].nilaiSoal[kriteriaId].benar += 1;
      }
    }

    // ===============================================
    // 2) HITUNG PERSENTASE & KONVERSI KE SUBKRITERIA
    // ===============================================
    for (const siswaId in siswaMap) {
      const data = siswaMap[siswaId];

      for (const k of kriteriaList) {
        const nilaiObj = data.nilaiSoal[k.id_kriteria];

        let persen = 0;
        if (nilaiObj && nilaiObj.total > 0) {
          persen = (nilaiObj.benar / nilaiObj.total) * 100; // <--- perbaikan besar
        }

        // Cari subkriteria yang match
        const sub = subkriteriaData.find((s) => {
          if (s.id_kriteria !== k.id_kriteria) return false;

          const match = s.nama_subkriteria.match(/(\d+)[–-](\d+)/);
          if (!match) return false;

          const min = Number(match[1]);
          const max = Number(match[2]);

          return persen >= min && persen <= max;
        });

        data.nilai[k.kode] = sub ? sub.nilai : 1;
      }

      delete data.nilaiSoal;
    }

    // ===============================================
    // 3) SIMPAN (INSERT / UPDATE)
    // ===============================================
    const nilaiArray = Object.values(siswaMap);

    for (const s of nilaiArray) {
      const existing = await Nilai.findOne({
        where: { id_siswa: s.id_siswa, id_ujian },
      });

      if (existing) {
        await existing.update({
          detail_nilai: s.nilai,
          total_nilai: null,
          ranking: null,
        });
      } else {
        await Nilai.create({
          id_siswa: s.id_siswa,
          id_ujian,
          detail_nilai: s.nilai,
          total_nilai: null,
          ranking: null,
        });
      }
    }

    return res.json({
      status: 'success',
      message: 'Nilai siswa berhasil dihitung dan disimpan',
      id_ujian,
      data: nilaiArray,
    });
  } catch (err) {
    console.error('🔥 ERROR hitungNilaiSiswa:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
}

//proses saw
export async function prosesSAW(req, res) {
  try {
    const id_ujian = Number(req.body.id_ujian || req.params.id_ujian);

    if (!id_ujian || isNaN(id_ujian)) {
      return res.status(400).json({ message: 'id_ujian harus berupa number' });
    }

    // Ambil data nilai
    const nilaiList = await Nilai.findAll({
      where: { id_ujian },
      include: [
        {
          model: Siswa,
          attributes: ['id_siswa', 'nama_siswa'],
        },
      ],
    });

    if (nilaiList.length === 0) {
      return res
        .status(404)
        .json({ message: 'Belum ada nilai siswa untuk ujian ini' });
    }

    // Ambil semua kriteria
    const kriteriaList = await Kriteria.findAll({
      order: [['kode', 'ASC']],
    });

    // ---- Normalisasi Matriks ----
    const matriks = nilaiList.map((n) => n.detail_nilai);

    // max dan min tiap kriteria
    const max = {};
    const min = {};

    kriteriaList.forEach((k) => {
      const key = k.kode;
      const values = matriks.map((m) => m[key]);

      max[key] = Math.max(...values);
      min[key] = Math.min(...values);
    });

    // Normalisasi
    const normalisasi = nilaiList.map((n) => {
      const norm = {};

      kriteriaList.forEach((k) => {
        const key = k.kode;
        const val = n.detail_nilai[key];

        if (k.tipe === 'benefit') {
          norm[key] = val / max[key];
        } else {
          norm[key] = min[key] / val;
        }
      });

      return {
        id_siswa: n.id_siswa,
        nama_siswa: n.Siswa.nama_siswa,
        nilai: norm,
      };
    });

    // ---- Hitung Nilai Akhir SAW ----
    const hasilAkhir = normalisasi.map((s) => {
      let total = 0;

      kriteriaList.forEach((k) => {
        total += s.nilai[k.kode] * k.bobot;
      });
      return {
        id_siswa: s.id_siswa,
        nama_siswa: s.nama_siswa,
        total_nilai: Number(total.toFixed(4)),
      };
    });

    // Urutkan ranking dari terbesar
    hasilAkhir.sort((a, b) => b.total_nilai - a.total_nilai);

    // Tambahkan ranking
    hasilAkhir.forEach((h, i) => {
      h.ranking = i + 1;
    });

    // Simpan hasil baru
    for (const h of hasilAkhir) {
      await HasilSaw.create({
        id_siswa: h.id_siswa,
        id_ujian,
        total_nilai: h.total_nilai,
        ranking: h.ranking,
      });
    }

    return res.json({
      message: '✔ Hasil SAW berhasil diproses dan disimpan',
      data: hasilAkhir,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: 'Terjadi kesalahan saat memproses SAW',
      error: err.message,
    });
  }
}

//GET HASIL SAW UNTUK SATU UJIAN
export const getHasilSAW = async (req, res) => {
  try {
    const id_ujian = Number(req.params.id_ujian);

    if (!id_ujian || isNaN(id_ujian)) {
      return res.status(400).json({
        message: 'id_ujian harus berupa number',
      });
    }

    const hasil = await HasilSaw.findAll({
      where: { id_ujian },
      attributes: ['id_siswa', 'total_nilai', 'ranking'],
      include: [
        {
          model: Siswa,
          attributes: ['nama_siswa'], // ambil nama saja
        },
      ],
      order: [['ranking', 'ASC']],
      distinct: true, // pastikan row unik
    });
    if (!hasil || hasil.length === 0) {
      return res.status(404).json({
        message: 'Belum ada hasil SAW untuk ujian ini',
      });
    }

    return res.json({
      message: '✔ Data hasil SAW berhasil diambil',
      data: hasil.map((h) => ({
        id_siswa: h.id_siswa,
        nama_siswa: h.Siswa?.nama_siswa || '-',
        total_nilai: h.total_nilai,
        ranking: h.ranking,
      })),
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: 'Gagal mengambil hasil SAW',
      error: error.message,
    });
  }
};

//reset hasil saw untuk ujian tertentu
export const resetSAW = async (req, res) => {
  try {
    const { id_ujian } = req.params;

    await Nilai.destroy({ where: { id_ujian } });

    res.json({ message: 'HASIL SAW berhasil direset 🎯' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
