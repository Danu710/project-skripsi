'use client';

import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { api } from '@/app/lib/api';

interface HitungNilaiResult {
  id_siswa: number;
  nama_siswa: string;
  nilai: {
    C1: number;
    C2: number;
    C3: number;
    C4: number;
    C5: number;
  };
}

export default function HitungNilaiPage() {
  const [idUjian, setIdUjian] = useState<number>(1);

  // MUTATION POST
  const hitungNilaiMutation = useMutation({
    mutationFn: async (id_ujian: number) => {
      const res = await api.post('/saw/hitung-nilai', { id_ujian });
      return res.data.data as HitungNilaiResult[];
    },
  });

  const handleProses = () => {
    hitungNilaiMutation.mutate(idUjian);
  };

  return (
    <div className='p-10'>
      <h1 className='text-2xl font-bold mb-5 text-gray-700 text-center'>
        Proses Perhitungan Nilai
      </h1>

      {/* PILIH UJIAN */}
      <div className='flex items-center gap-3 mb-6 justify-center'>
        <label className='font-medium'>Pilih ID Ujian:</label>
        <input
          type='number'
          value={idUjian}
          onChange={(e) => setIdUjian(Number(e.target.value))}
          className='border px-3 py-2 rounded w-24'
        />

        <button
          onClick={handleProses}
          className='bg-blue-600 text-white px-4 py-2 rounded'>
          Proses Nilai
        </button>
      </div>

      {/* LOADING */}
      {hitungNilaiMutation.isLoading && (
        <p className='text-center text-gray-600'>Menghitung Nilai...</p>
      )}

      {/* ERROR */}
      {hitungNilaiMutation.isError && (
        <p className='text-center text-red-600'>
          Terjadi error saat memproses Nilai
        </p>
      )}

      {/* HASIL */}
      {hitungNilaiMutation.data && (
        <table className='w-full border border-gray-300 mt-5'>
          <thead>
            <tr>
              <th>Nama Siswa</th>
              <th>C1</th>
              <th>C2</th>
              <th>C3</th>
              <th>C4</th>
              <th>C5</th>
            </tr>
          </thead>
          <tbody>
            {hitungNilaiMutation.data.map((item) => (
              <tr key={item.id_siswa} className='text-center'>
                <td>{item.nama_siswa}</td>
                <td>{item.nilai.C1}</td>
                <td>{item.nilai.C2}</td>
                <td>{item.nilai.C3}</td>
                <td>{item.nilai.C4}</td>
                <td>{item.nilai.C5}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
