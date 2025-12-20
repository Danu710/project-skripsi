'use client';

import { useQuery } from '@tanstack/react-query';
import { api } from '@/app/lib/api';
import React from 'react';

export interface SoalData {
  id_soal: number;
  pertanyaan: string;
}

export interface SiswaData {
  id_siswa: number;
  nama_siswa: string;
  kelas: string;
  jurusan: string;
}

export interface UjianData {
  id_ujian: number;
  nama_ujian: string;
}

export interface Jawaban {
  id_jawaban: number;
  id_siswa: number;
  id_soal: number;
  jawaban_text: string;
  status: 'benar' | 'salah' | string;
  createdAt: string;
  updatedAt: string;
  Soal?: SoalData | null;
  Siswa?: SiswaData | null;
  Ujian?: UjianData | null;
}

export default function JawabanPage() {
  const { data, isLoading, isError } = useQuery<Jawaban[]>({
    queryKey: ['get-jawaban'],
    queryFn: async () => {
      const res = await api.get('http://localhost:5000/api/jawaban');
      return res.data as Jawaban[];
    },
  });

  // LOADING STATE
  if (isLoading) {
    return (
      <div className='p-10 text-center text-gray-600'>
        Memuat data jawaban...
      </div>
    );
  }

  // ERROR STATE
  if (isError) {
    return (
      <div className='p-10 text-center text-red-600'>
        Terjadi kesalahan saat mengambil data jawaban.
      </div>
    );
  }

  return (
    <div className='p-10'>
      <h1 className='text-2xl font-bold text-gray-700 text-center'>
        Daftar Jawaban Siswa
      </h1>

      {/* LIST JAWABAN */}
      <div className='mt-8 space-y-4'>
        {data && data.length > 0 ? (
          data.map((item) => (
            <div
              key={item.id_jawaban}
              className='bg-white p-5 rounded-lg shadow border'>
              <h2 className='text-lg font-semibold text-gray-800'>
                Soal: {item.Soal?.pertanyaan ?? 'Tidak ada data soal'}
              </h2>

              <div className='mt-3 text-gray-600 space-y-1'>
                <p className='flex flex-row justify-start gap-5'>
                  <strong>Siswa :</strong> {item.Siswa?.nama_siswa ?? 'Unknown'}{' '}
                  (ID: {item.id_siswa})
                  <strong>Kelas :{item.Siswa?.kelas ?? 'Unknown'} </strong>
                  <strong>Jurusan : {item.Siswa?.jurusan ?? 'Unknown'}</strong>
                </p>

                <p className='flex flex-row justify-start gap-3'>
                  <strong>Soal:</strong>{' '}
                  {item.Soal?.pertanyaan ?? 'Tidak ada data soal'}
                  <strong>Ujian:</strong>{' '}
                  {item.Ujian?.nama_ujian ?? 'Tidak ada data ujian'}
                  <strong>Id ujian: {item.Ujian?.id_ujian ?? 'Unknown'}</strong>
                </p>
                <p>
                  <strong>Jawaban Siswa:</strong> {item.jawaban_text}
                </p>

                <p>
                  <strong>ID Soal:</strong> {item.id_soal}
                </p>
              </div>
            </div>
          ))
        ) : (
          <p className='text-center text-gray-500 mt-10'>
            Tidak ada data jawaban.
          </p>
        )}
      </div>
    </div>
  );
}
