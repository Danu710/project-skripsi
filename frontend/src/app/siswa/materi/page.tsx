'use client';

import { useQuery } from '@tanstack/react-query';
import { api } from '@/app/lib/api';

type Materi = {
  id_materi: number;
  judul: string;
  deskripsi: string;
  file_materi: string;
  createdAt: string;
};

export default function MateriPage() {
  const { data, isLoading, isError } = useQuery<Materi[]>({
    queryKey: ['materi-siswa'],
    queryFn: async () => {
      const res = await api.get('http://localhost:5000/api/materi');
      return res.data;
    },
  });

  return (
    <div className='p-8'>
      <h1 className='text-3xl font-bold text-gray-800 text-center'>
        📘 Daftar Materi Pembelajaran
      </h1>

      {isLoading && (
        <p className='mt-4 text-blue-600 text-center'>Memuat materi...</p>
      )}

      {isError && (
        <p className='mt-4 text-red-600 text-center'>
          Gagal memuat materi dari server.
        </p>
      )}

      <div className='mt-8 space-y-5'>
        {data?.map((item) => (
          <div
            key={item.id_materi}
            className='p-6 bg-white border shadow-sm rounded-lg hover:shadow-md transition'>
            <h2 className='text-xl font-semibold text-gray-800'>
              {item.judul}
            </h2>

            <p className='mt-2 text-gray-600'>{item.deskripsi}</p>

            <p className='text-sm text-gray-500 mt-2'>
              Diunggah pada:{' '}
              {new Date(item.createdAt).toLocaleDateString('id-ID')}
            </p>

            <a
              href={`http://localhost:5000/uploads/materi/${item.file_materi}`}
              target='_blank'
              className='text-blue-600 underline'>
              Lihat Dokumen
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}
