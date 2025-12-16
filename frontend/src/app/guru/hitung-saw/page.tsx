'use client';

import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { api } from '@/app/lib/api';
import { Card, CardBody, Input, Button } from '@heroui/react';
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from '@heroui/table';

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
    <div className='p-10 flex flex-col items-center gap-6'>
      {/* JUDUL */}
      <h1 className='text-3xl font-bold text-gray-700 text-center'>
        Proses Perhitungan SAW
      </h1>
      {/* PILIH UJIAN */}
      <Card className='w-full max-w-xl shadow-md'>
        <CardBody className='flex flex-col gap-4'>
          <label className='font-medium text-gray-600'>Pilih ID Ujian</label>

          <Input
            type='number'
            radius='md'
            size='md'
            placeholder='Masukkan ID Ujian...'
            value={idUjian ? idUjian.toString() : ''}
            onChange={(e) => setIdUjian(Number(e.target.value))}
          />

          <Button
            color='primary'
            fullWidth
            onClick={handleProses}
            isLoading={sawMutation.isLoading}>
            Proses SAW
          </Button>

          <Button
            color='secondary'
            fullWidth
            onClick={() =>
              window.open(
                `http://localhost:5000/api/saw/cetak-pdf/${idUjian}`,
                '_blank'
              )
            }>
            Cetak Laporan PDF
          </Button>
        </CardBody>
      </Card>

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
        <Card className='w-full max-w-4xl shadow-lg mt-4'>
          <CardBody>
            <h2 className='text-xl font-semibold mb-4'>
              Hasil Perhitungan SAW
            </h2>

            <Table aria-label='Hasil Perhitungan SAW'>
              <TableHeader>
                <TableColumn>Nama Siswa</TableColumn>
                <TableColumn>Total Nilai</TableColumn>
                <TableColumn>Ranking</TableColumn>
              </TableHeader>

              <TableBody>
                {sawMutation.data.map((item) => (
                  <TableRow key={item.id_siswa}>
                    <TableCell>{item.nama_siswa}</TableCell>
                    <TableCell className='font-semibold'>
                      {item.total_nilai}
                    </TableCell>
                    <TableCell className='font-bold'>{item.ranking}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardBody>
        </Card>
      )}
    </div>
  );
}
