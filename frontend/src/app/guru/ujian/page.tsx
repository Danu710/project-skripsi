'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/app/lib/api';

import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

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

// ==== ZOD VALIDASI ====
const ujianSchema = z.object({
  nama_ujian: z.string().min(3, 'Nama ujian wajib diisi'),
  tanggal_ujian: z.string().min(1, 'Tanggal ujian wajib diisi'),
  durasi: z.coerce.number().min(10, 'Durasi minimal 10 menit'),
  id_guru: z.coerce.number(),
});

type UjianForm = z.infer<typeof ujianSchema>;

export type UjianRoot = Ujian[];

export interface Ujian {
  id_ujian: number;
  nama_ujian: string;
  tanggal_ujian: string;
  durasi: number;
  id_guru: number;
}

export default function UjianPage() {
  const queryClient = useQueryClient();
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const [editingUjian, setEditingUjian] = useState<Ujian | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<UjianForm>({
    resolver: zodResolver(ujianSchema),
    defaultValues: { id_guru: 5 },
  });

  // === GET DATA UJIAN ===
  const { data, isLoading, isError } = useQuery<UjianRoot>({
    queryKey: ['get-ujian'],
    queryFn: async () => {
      const res = await api.get('/ujian');
      return res.data;
    },
  });

  // === POST / UPDATE MUTATION ===
  const saveMutation = useMutation({
    mutationFn: async (body: UjianForm & { id?: number }) => {
      if (body.id) {
        // Update
        return api.put(`/ujian/${body.id}`, body);
      } else {
        // Create
        return api.post('/ujian', body);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['get-ujian']);
      onClose();
      reset();
      setEditingUjian(null);
    },
  });

  // === DELETE MUTATION ===
  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      return api.delete(`/ujian/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['get-ujian']);
    },
  });

  const onSubmit = (values: UjianForm) => {
    const payload = editingUjian
      ? { ...values, id: editingUjian.id_ujian }
      : values;
    saveMutation.mutate(payload);
  };

  const handleEdit = (ujian: Ujian) => {
    setEditingUjian(ujian);
    setValue('nama_ujian', ujian.nama_ujian);
    setValue('tanggal_ujian', ujian.tanggal_ujian.split('T')[0]);
    setValue('durasi', ujian.durasi);
    setValue('id_guru', ujian.id_guru);
    onOpen();
  };

  const handleDelete = (id: number) => {
    if (confirm('Yakin ingin menghapus ujian ini?')) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <div className='p-10'>
      <div className='flex justify-between items-center'>
        <h1 className='text-2xl font-bold text-gray-700'>Daftar Ujian</h1>
        <Button
          color='primary'
          onPress={() => {
            setEditingUjian(null);
            reset();
            onOpen();
          }}>
          Tambah Ujian
        </Button>
      </div>

      {isLoading && <p className='mt-4 text-blue-600'>Memuat data ujian...</p>}
      {isError && (
        <p className='mt-4 text-red-600'>Gagal memuat data dari server.</p>
      )}

      <div className='mt-6 space-y-4'>
        {data?.map((item) => (
          <div
            key={item.id_ujian}
            className='bg-white shadow p-5 rounded-lg border flex justify-between items-start'>
            <div>
              <h2 className='text-lg font-semibold text-gray-800'>
                {item.nama_ujian}
              </h2>
              <p className='text-gray-600'>
                <strong>ID Ujian:</strong> {item.id_ujian}
              </p>
              <p className='text-gray-600'>
                <strong>Tanggal:</strong>{' '}
                {new Date(item.tanggal_ujian).toLocaleDateString()}
              </p>
              <p className='text-gray-600'>
                <strong>Durasi:</strong> {item.durasi} menit
              </p>
              <p className='text-gray-600'>
                <strong>ID Guru:</strong> {item.id_guru}
              </p>
            </div>

            <div className='flex flex-col gap-2'>
              <Button
                size='sm'
                color='success'
                onPress={() => handleEdit(item)}>
                Edit
              </Button>
              <Button
                size='sm'
                color='danger'
                onPress={() => handleDelete(item.id_ujian)}>
                Hapus
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* MODAL ADD / EDIT */}
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} placement='center'>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className='font-bold text-xl'>
                {editingUjian ? 'Edit Ujian' : 'Tambah Ujian'}
              </ModalHeader>

              <ModalBody>
                <form
                  id='formUjian'
                  onSubmit={handleSubmit(onSubmit)}
                  className='space-y-4'>
                  <Input
                    label='Nama Ujian'
                    variant='bordered'
                    {...register('nama_ujian')}
                    errorMessage={errors.nama_ujian?.message}
                  />
                  <Input
                    type='date'
                    label='Tanggal Ujian'
                    variant='bordered'
                    {...register('tanggal_ujian')}
                    errorMessage={errors.tanggal_ujian?.message}
                  />
                  <Input
                    type='number'
                    label='Durasi (menit)'
                    variant='bordered'
                    {...register('durasi')}
                    errorMessage={errors.durasi?.message}
                  />
                  <Input
                    type='number'
                    label='ID Guru'
                    variant='bordered'
                    {...register('id_guru')}
                    errorMessage={errors.id_guru?.message}
                  />
                </form>
              </ModalBody>

              <ModalFooter>
                <Button variant='light' onPress={onClose}>
                  Batal
                </Button>
                <Button
                  color='primary'
                  type='submit'
                  form='formUjian'
                  isLoading={saveMutation.isLoading}>
                  Simpan
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}
