'use client';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/app/lib/api';
import { Card, CardBody, Spinner } from '@heroui/react';

export default function MateriList({ id_guru }: { id_guru: number }) {
  const { data, isLoading } = useQuery({
    queryKey: ['materi', id_guru],
    queryFn: async () => {
      const res = await api.get('/materi');
      return res.data.filter((m: any) => m.id_guru === id_guru);
    },
  });

  if (isLoading) return <Spinner label='Memuat materi...' />;

  return (
    <div className='grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6'>
      {data?.length ? (
        data.map((materi: any) => (
          <Card key={materi.id_materi} className='shadow-md border'>
            <CardBody>
              <h3 className='font-semibold text-gray-800'>
                {materi.judul_materi}
              </h3>
              <p className='text-gray-500 text-sm mt-1'>{materi.deskripsi}</p>
              {materi.file_materi && (
                <a
                  href={`http://localhost:5000/${materi.file_materi}`}
                  target='_blank'
                  className='text-blue-600 text-sm mt-2 inline-block'>
                  Lihat File
                </a>
              )}
            </CardBody>
          </Card>
        ))
      ) : (
        <p className='text-gray-500 text-center col-span-full'>
          Belum ada materi
        </p>
      )}
    </div>
  );
}
