'use client';

import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { api } from '@/app/lib/api';
import { Button, Input, Card, CardBody } from '@heroui/react';
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from '@heroui/table';

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
    <div className='p-10 h-full flex flex-col items-center gap-6'>
      {/* JUDUL */}
      <h1 className='text-3xl font-bold text-gray-700 text-center'>
        Proses Perhitungan Nilai
      </h1>

      {/* PILIH UJIAN */}
      <Card className='w-full max-w-xl shadow-md'>
        <CardBody className='flex flex-col gap-4'>
          <div className='flex flex-col gap-3'>
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
              isLoading={hitungNilaiMutation.isLoading}>
              Proses Nilai
            </Button>
          </div>
        </CardBody>
      </Card>

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
        <Card className='w-full max-w-4xl shadow-lg mt-4'>
          <CardBody>
            <h2 className='text-xl font-semibold mb-4'>
              Hasil Perhitungan Nilai
            </h2>

            <Table aria-label='Hasil Nilai Siswa'>
              <TableHeader>
                <TableColumn>NAMA SISWA</TableColumn>
                <TableColumn>C1</TableColumn>
                <TableColumn>C2</TableColumn>
                <TableColumn>C3</TableColumn>
                <TableColumn>C4</TableColumn>
                <TableColumn>C5</TableColumn>
              </TableHeader>

              <TableBody>
                {hitungNilaiMutation.data.map((item) => (
                  <TableRow key={item.id_siswa}>
                    <TableCell>{item.nama_siswa}</TableCell>
                    <TableCell>{item.nilai.C1}</TableCell>
                    <TableCell>{item.nilai.C2}</TableCell>
                    <TableCell>{item.nilai.C3}</TableCell>
                    <TableCell>{item.nilai.C4}</TableCell>
                    <TableCell>{item.nilai.C5}</TableCell>
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
