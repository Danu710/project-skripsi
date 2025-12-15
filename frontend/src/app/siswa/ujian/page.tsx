'use client';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { Spinner, Button } from '@heroui/react';
import { api } from '@/app/lib/api';

export type UjianRoot = Ujian[];

export interface Ujian {
  id_ujian: number;
  nama_ujian: string;
  tanggal_ujian: string;
  durasi: number;
}

export default function PageUjian() {
  const router = useRouter();
  const { data, isLoading, isError } = useQuery<UjianRoot>({
    queryKey: ['get-ujian'],
    queryFn: async () => {
      const res = await api.get('/ujian');
      return res.data;
    },
  });

  const handleKerjakan = async (id_ujian: number) => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    try {
      await api.post('/ujian/mulai', {
        id_siswa: user.id,
        id_ujian,
      });

      router.push(`/siswa/soal/${id_ujian}`);
    } catch (err) {
      console.log(err);
      alert('Gagal memulai ujian');
    }
  };

  if (isLoading)
    return (
      <div className='flex justify-center p-20'>
        <Spinner />
      </div>
    );

  if (isError)
    return <div className='p-4 text-red-500'>Gagal memuat data ujian.</div>;

  return (
    <div className='p-6'>
      <h1 className='text-xl font-semibold mb-4'>Daftar Tes</h1>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
        {data?.map((item) => (
          <div
            key={item.id_ujian}
            className='bg-white shadow p-5 rounded-lg border'>
            <h2 className='text-lg font-semibold text-gray-800'>
              {item.nama_ujian}
            </h2>

            <div className='mt-2 text-gray-600'>
              <p>
                <strong>Tanggal:</strong>{' '}
                {new Date(item.tanggal_ujian).toLocaleDateString()}
              </p>
              <p>
                <strong>Durasi:</strong> {item.durasi} menit
              </p>

              <div className='mt-4 flex gap-4'>
                <Button
                  color='success'
                  className='mt-4'
                  onPress={() => handleKerjakan(item.id_ujian)}>
                  Kerjakan Tes
                </Button>

                <Button
                  color='primary'
                  className='mt-4'
                  onPress={() => router.push(`/siswa/nilai/${item.id_ujian}`)}>
                  Lihat Tes
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
