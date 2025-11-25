'use client';

import { useQuery } from '@tanstack/react-query';
import { api } from '@/app/lib/api';

// ========== TYPE DATA ==========

export type NilaiRoot = Nilai[];

export interface Nilai {
  id_nilai: number;
  id_siswa: number;
  id_ujian: number;
  total_nilai: number | null;
  detail_nilai: DetailNilai;
  ranking: number | null;
  createdAt: string;
  updatedAt: string;
  Siswa: Siswa;
  Ujian: Ujian;
}

export interface DetailNilai {
  C1: number;
  C2: number;
  C3: number;
  C4: number;
  C5: number;
}

export interface Siswa {
  id_siswa: number;
  nama_siswa: string;
  kelas: string;
}

export interface Ujian {
  id_ujian: number;
  nama_ujian: string;
}

// ========== PAGE ==========

export default function NilaiPage() {
  const { data, isLoading, isError } = useQuery<NilaiRoot>({
    queryKey: ['get-nilai'],
    queryFn: async () => {
      const res = await api.get('http://localhost:5000/api/nilai');
      return res.data.data;
    },
  });

  return (
    <div className='p-10'>
      <h1 className='text-2xl font-bold text-gray-700 text-center'>
        Daftar Nilai Siswa
      </h1>

      {isLoading && <p className='mt-4 text-blue-600'>Memuat nilai...</p>}
      {isError && <p className='mt-4 text-red-600'>Gagal memuat data nilai.</p>}

      <div className='mt-6 space-y-4'>
        {data?.map((item) => (
          <div
            key={item.id_nilai}
            className='bg-white shadow p-5 rounded-lg border'>
            <h2 className='text-lg font-semibold text-gray-800'>
              {item.Siswa.nama_siswa} — {item.Ujian.nama_ujian}
            </h2>

            <div className='mt-2 text-gray-600'>
              <p>
                <strong>Kelas:</strong> {item.Siswa.kelas}
              </p>
              <p>
                <strong>Total Nilai:</strong>{' '}
                {item.total_nilai ?? 'Belum dihitung'}
              </p>

              <p className='mt-2 font-semibold'>Detail Nilai Per Kriteria:</p>
              <ul className='list-disc ml-6'>
                <li>C1: {item.detail_nilai.C1}</li>
                <li>C2: {item.detail_nilai.C2}</li>
                <li>C3: {item.detail_nilai.C3}</li>
                <li>C4: {item.detail_nilai.C4}</li>
                <li>C5: {item.detail_nilai.C5}</li>
              </ul>

              <p className='mt-3'>
                <strong>Dibuat:</strong>{' '}
                {new Date(item.createdAt).toLocaleString()}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
