'use client';

import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/app/lib/api';
import type { Materi } from '../types/materi';
import type { User } from '../types/user';

import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import { Modal, ModalContent, ModalHeader, ModalBody } from '@heroui/modal';
import { Button } from '@heroui/button';
import { Card, CardHeader, CardBody, CardFooter } from '@heroui/card';
import { Input, Textarea } from '@heroui/input';

const schema = z.object({
  judul_materi: z.string().min(3, 'Judul minimal 3 karakter'),
  deskripsi: z.string().optional(),
  file_materi: z
    .any()
    .refine((file) => file?.length === 1, 'File wajib diupload'),
});

export default function MateriListWithUpload() {
  const [isOpen, setIsOpen] = useState(false);
  const [idGuru, setIdGuru] = useState<User | null>(null);
  const queryClient = useQueryClient();

  // GET DATA
  const { data, isLoading } = useQuery<Materi[]>({
    queryKey: ['materi'],
    queryFn: async () => {
      const res = await api.get('/materi');
      return res.data;
    },
  });

  // FORM
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  });

  const mutation = useMutation({
    mutationFn: async (formData) => {
      return await api.post('/materi', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['materi']);
      setIsOpen(false);
      reset();
    },
  });

  // Ambil user dari localStorage
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    setIdGuru(user?.id);
  }, []);

  // Kalau belum dapat id_guru, jangan render
  if (!idGuru) return <p>Mengambil data guru...</p>;

  const onSubmit = (values) => {
    const fd = new FormData();
    fd.append('judul_materi', values.judul_materi);
    fd.append('deskripsi', values.deskripsi || '');
    fd.append('id_guru', idGuru); // ⬅ dari localStorage
    fd.append('file_materi', values.file_materi[0]);

    mutation.mutate(fd);
  };

  if (isLoading) return <p>Loading...</p>;

  return (
    <div className='p-6 bg-white rounded-xl shadow-md space-y-6'>
      {/* HEADER */}
      <div className='flex justify-between items-center'>
        <h1 className='text-2xl font-bold'>Daftar Materi</h1>
        <Button color='primary' onPress={() => setIsOpen(true)}>
          Tambah Materi
        </Button>
      </div>

      {/* LIST */}
      {data.map((item: Materi) => (
        <Card key={item.id_materi} className='border shadow-sm'>
          <CardHeader>
            <h2 className='font-semibold text-lg'>{item.judul_materi}</h2>
          </CardHeader>

          <CardBody>
            <p>{item.deskripsi}</p>
          </CardBody>

          <CardFooter>
            <a
              href={`http://localhost:5000/uploads/materi/${item.file_materi}`}
              target='_blank'
              className='text-blue-600 underline'>
              Lihat Dokumen
            </a>
          </CardFooter>
        </Card>
      ))}

      {/* MODAL UPLOAD */}
      <Modal isOpen={isOpen} onOpenChange={setIsOpen} size='lg'>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>
                <p className='text-xl font-semibold'>Tambah Materi Baru</p>
              </ModalHeader>

              <ModalBody>
                <Card>
                  <form onSubmit={handleSubmit(onSubmit)}>
                    <CardBody className='space-y-4'>
                      <Input
                        label='Judul Materi'
                        variant='bordered'
                        {...register('judul_materi')}
                        isInvalid={!!errors.judul_materi}
                        errorMessage={errors.judul_materi?.message}
                      />

                      <Textarea
                        label='Deskripsi'
                        variant='bordered'
                        {...register('deskripsi')}
                      />

                      <Input
                        type='file'
                        label='Upload PDF'
                        accept='application/pdf'
                        {...register('file_materi')}
                        isInvalid={!!errors.file_materi}
                        errorMessage={errors.file_materi?.message}
                      />
                    </CardBody>

                    <CardFooter className='flex justify-end gap-3'>
                      <Button variant='flat' onPress={onClose}>
                        Batal
                      </Button>
                      <Button
                        color='primary'
                        type='submit'
                        isLoading={mutation.isPending}>
                        Simpan
                      </Button>
                    </CardFooter>
                  </form>
                </Card>
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}
