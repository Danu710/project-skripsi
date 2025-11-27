'use client';

import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useParams } from 'next/navigation';
import { Card, CardBody, CardHeader } from '@heroui/card';
import { Skeleton } from '@heroui/skeleton';
import type { SawProcessed, SawItem } from '@/app/siswa/types/saw';

export default function NilaiPage() {
  const { id } = useParams(); // id_ujian

  const { data, isLoading, error } = useQuery<SawProcessed>({
    queryKey: ['nilai', id],
    queryFn: async () => {
      const res = await axios.get(`http://localhost:5000/api/saw/${id}`);
      return res.data.data;
    },
  });

  if (isLoading)
    return (
      <div className='p-6 space-y-4'>
        {[1, 2, 3].map((i) => (
          <Card key={i} className='p-4'>
            <Skeleton className='h-6 w-1/2 rounded-md' />
            <Skeleton className='h-5 w-1/3 mt-2 rounded-md' />
            <Skeleton className='h-5 w-1/4 mt-2 rounded-md' />
          </Card>
        ))}
      </div>
    );
  if (error)
    return (
      <div className='p-6'>
        <Card className='bg-yellow-100 border border-yellow-400'>
          <CardBody>
            <p className='text-yellow-700 font-semibold'>
              Guru belum memproses nilai SAW untuk ujian ini.
            </p>
          </CardBody>
        </Card>
      </div>
    );

  return (
    <div className='p-6'>
      <h1 className='text-xl font-bold mb-4'>Hasil Nilai Ujian</h1>

      <div className='space-y-4'>
        {data.map((item: SawItem, index: number) => (
          <Card key={index} className='border border-gray-200'>
            <CardHeader className='font-semibold text-lg'>
              {item.nama_siswa}
            </CardHeader>

            <CardBody className='text-gray-700 space-y-1'>
              <p>
                <strong>Total Nilai:</strong> {item.total_nilai ?? 'Belum ada'}
              </p>
              <p>
                <strong>Ranking:</strong> {item.ranking}
              </p>
            </CardBody>
          </Card>
        ))}
      </div>
    </div>
  );
}
