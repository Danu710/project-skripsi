'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/app/lib/api';
import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalFooter,
  useDisclosure,
} from '@heroui/react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

export type Root = Root2[];

const soalSchema = z.object({
  id_ujian: z.coerce.number().min(1),
  id_kriteria: z.coerce.number().min(1),
  pertanyaan: z.string().min(3),
  opsi_a: z.string().min(1),
  opsi_b: z.string().min(1),
  opsi_c: z.string().min(1),
  opsi_d: z.string().min(1),
  jawaban_benar: z.string().min(1),
});

type SoalSchema = z.infer<typeof soalSchema>;

export interface Root2 {
  id_soal: number;
  id_ujian: number;
  id_kriteria: number;
  pertanyaan: string;
  opsi_a: string;
  opsi_b: string;
  opsi_c: string;
  opsi_d: string;
  jawaban_benar: string;
  createdAt: string;
  updatedAt: string;
  Ujian: Ujian;
}

export interface Ujian {
  id_ujian: number;
  nama_ujian: string;
  tanggal_ujian: string;
  durasi: number;
}

export default function SoalPage() {
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SoalSchema>({
    resolver: zodResolver(soalSchema),
  });

  // Fetch otomatis
  const { data, isLoading, isError } = useQuery<Root>({
    queryKey: ['get-soal'],
    queryFn: async () => {
      const res = await api.get('http://localhost:5000/api/soal');
      return res.data;
    },
  });

  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();

  const mutation = useMutation({
    mutationFn: async (data: SoalSchema) => {
      const res = await api.post('http://localhost:5000/api/soal', data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['get-soal'] });
      onClose();
      reset();
    },
  });

  const onSubmit = (data: SoalSchema) => mutation.mutate(data);
  return (
    <div className='p-10'>
      <h1 className='text-2xl font-bold text-gray-700 text-center'>
        Daftar Soal
      </h1>

      <Button color='primary' onPress={onOpen}>
        Tambah Soal
      </Button>

      {/* STATE UI */}
      {isLoading && <p className='mt-4 text-blue-600'>Loading data soal...</p>}
      {isError && (
        <p className='mt-4 text-red-600'>Gagal memuat data soal dari server.</p>
      )}

      {/* DATA LIST */}
      <div className='mt-6 space-y-4'>
        {data?.map((item) => (
          <div
            key={item.id_soal}
            className='bg-white shadow p-5 rounded-lg border'>
            <h2 className='text-lg font-semibold text-gray-800'>
              {item.pertanyaan}
            </h2>

            <div className='mt-2 text-gray-600'>
              <p>
                <strong>ID Soal:</strong> {item.id_soal}
              </p>
              <p>
                <strong>Kriteria:</strong> {item.id_kriteria}
              </p>
              <p>
                <strong>Jawaban Benar:</strong> {item.jawaban_benar}
              </p>

              {/* OPSI */}
              <div className='mt-3'>
                <p>
                  <strong>Opsi </strong> {item.opsi_a}
                </p>
                <p>
                  <strong>Opsi</strong> {item.opsi_b}
                </p>
                <p>
                  <strong>Opsi</strong> {item.opsi_c}
                </p>
                <p>
                  <strong>Opsi </strong> {item.opsi_d}
                </p>
              </div>

              {/* UJIAN */}
              <div className='mt-4 border-t pt-3'>
                <p className='font-semibold text-gray-700'>Informasi Ujian</p>
                <p>
                  <strong>Nama Ujian:</strong> {item.Ujian.nama_ujian}
                </p>
                <p>
                  <strong>Tanggal:</strong>{' '}
                  {new Date(item.Ujian.tanggal_ujian).toLocaleDateString()}
                </p>
                <p>
                  <strong>Durasi:</strong> {item.Ujian.durasi} menit
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(close) => (
            <>
              <ModalHeader className='text-lg font-bold'>
                Tambah Soal Baru
              </ModalHeader>

              <form onSubmit={handleSubmit(onSubmit)}>
                <ModalBody className='space-y-4'>
                  <Input
                    label='ID Ujian'
                    type='number'
                    inputMode='numeric'
                    {...register('id_ujian')}
                    isInvalid={!!errors.id_ujian}
                    errorMessage={errors.id_ujian?.message}
                  />

                  <Input
                    label='ID Kriteria'
                    type='number'
                    inputMode='numeric'
                    {...register('id_kriteria')}
                    isInvalid={!!errors.id_kriteria}
                    errorMessage={errors.id_kriteria?.message}
                  />

                  <Input
                    label='Pertanyaan'
                    {...register('pertanyaan')}
                    isInvalid={!!errors.pertanyaan}
                    errorMessage={errors.pertanyaan?.message}
                  />

                  <div className='grid grid-cols-2 gap-4'>
                    <Input
                      label='Opsi A'
                      {...register('opsi_a')}
                      isInvalid={!!errors.opsi_a}
                      errorMessage={errors.opsi_a?.message}
                    />

                    <Input
                      label='Opsi B'
                      {...register('opsi_b')}
                      isInvalid={!!errors.opsi_b}
                      errorMessage={errors.opsi_b?.message}
                    />

                    <Input
                      label='Opsi C'
                      {...register('opsi_c')}
                      isInvalid={!!errors.opsi_c}
                      errorMessage={errors.opsi_c?.message}
                    />

                    <Input
                      label='Opsi D'
                      {...register('opsi_d')}
                      isInvalid={!!errors.opsi_d}
                      errorMessage={errors.opsi_d?.message}
                    />
                  </div>

                  <Input
                    label='Jawaban Benar'
                    {...register('jawaban_benar')}
                    isInvalid={!!errors.jawaban_benar}
                    errorMessage={errors.jawaban_benar?.message}
                  />
                </ModalBody>

                <ModalFooter>
                  <Button variant='flat' onPress={close}>
                    Batal
                  </Button>

                  <Button
                    color='primary'
                    type='submit'
                    isLoading={mutation.isPending}>
                    Simpan
                  </Button>
                </ModalFooter>
              </form>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}
