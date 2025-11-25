'use client';

import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { api } from '@/app/lib/api';

interface SawResult {
  id_siswa: number;
  nama_siswa: string;
  total_nilai: number;
  ranking: number;
}

export default function HitungSawPage() {
  const [idUjian, setIdUjian] = useState<number>(1);

  // MUTATION POST
  const sawMutation = useMutation({
    mutationFn: async (id_ujian: number) => {
      const res = await api.post('/saw/proses', { id_ujian });
      return res.data.data as SawResult[];
    },
  });

  const handleProses = () => {
    sawMutation.mutate(idUjian);
  };

  return (
    <div className='p-10'>
      <h1 className='text-2xl font-bold mb-5 text-gray-700 text-center'>
        Proses Perhitungan SAW
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
          Proses SAW
        </button>
      </div>

      {/* LOADING */}
      {sawMutation.isLoading && (
        <p className='text-center text-gray-600'>Menghitung SAW...</p>
      )}

      {/* ERROR */}
      {sawMutation.isError && (
        <p className='text-center text-red-600'>
          Terjadi error saat memproses SAW
        </p>
      )}

      {/* HASIL */}
      {sawMutation.data && (
        <table className='w-full border border-gray-300 mt-5'>
          <thead className='bg-gray-200'>
            <tr>
              <th className='p-2 border'>Nama Siswa</th>
              <th className='p-2 border'>Total Nilai</th>
              <th className='p-2 border'>Ranking</th>
            </tr>
          </thead>
          <tbody>
            {sawMutation.data.map((item) => (
              <tr key={item.id_siswa} className='text-center'>
                <td className='p-2 border'>{item.nama_siswa}</td>
                <td className='p-2 border font-semibold'>{item.total_nilai}</td>
                <td className='p-2 border font-bold'>{item.ranking}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
