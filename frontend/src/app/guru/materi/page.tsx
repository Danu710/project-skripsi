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
  file_materi: z.any().optional(),
});

type FormValues = z.infer<typeof schema>;

export default function MateriListWithUpload() {
  const [isOpen, setIsOpen] = useState(false);
  const [editingMateri, setEditingMateri] = useState<Materi | null>(null);
  const [idGuru, setIdGuru] = useState<User | null>(null);
  const queryClient = useQueryClient();

  // ambil data materi
  const { data, isLoading } = useQuery<Materi[]>({
    queryKey: ['materi'],
    queryFn: async () => {
      const res = await api.get('/materi');
      return res.data;
    },
  });

  // CREATE MUTATION
  const createMutation = useMutation({
    mutationFn: async (formData: FormData) =>
      api.post('/materi', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      }),
    onSuccess: () => queryClient.invalidateQueries(['materi']),
  });

  // UPDATE MUTATION
  const updateMutation = useMutation({
    mutationFn: async ({ id, formData }: { id: number; formData: FormData }) =>
      api.put(`/materi/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      }),
    onSuccess: () => queryClient.invalidateQueries(['materi']),
  });

  // DELETE MUTATION
  const deleteMutation = useMutation({
    mutationFn: async (id: number) => api.delete(`/materi/${id}`),
    onSuccess: () => queryClient.invalidateQueries(['materi']),
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  // ambil user dari localStorage
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    setIdGuru(user?.id);
  }, []);

  if (!idGuru) return <p>Mengambil data guru...</p>;
  if (isLoading) return <p>Loading...</p>;

  const onSubmit = (values: FormValues) => {
    const fd = new FormData();
    fd.append('judul_materi', values.judul_materi);
    fd.append('deskripsi', values.deskripsi || '');
    fd.append('id_guru', idGuru);
    if (values.file_materi && values.file_materi.length > 0) {
      fd.append('file_materi', values.file_materi[0]);
    }

    if (editingMateri) {
      updateMutation.mutate({ id: editingMateri.id_materi, formData: fd });
    } else {
      createMutation.mutate(fd);
    }

    setIsOpen(false);
    setEditingMateri(null);
    reset();
  };

  const handleEdit = (materi: Materi) => {
    setEditingMateri(materi);
    reset({
      judul_materi: materi.judul_materi,
      deskripsi: materi.deskripsi,
    });
    setIsOpen(true);
  };

  const handleDelete = (id: number) => {
    if (confirm('Apakah Anda yakin ingin menghapus materi ini?')) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <div className='p-6 bg-white rounded-xl shadow-md space-y-6'>
      <div className='flex justify-between items-center'>
        <h1 className='text-2xl font-bold'>Daftar Materi</h1>
        <Button
          color='primary'
          onPress={() => {
            setEditingMateri(null);
            setIsOpen(true);
          }}>
          Tambah Materi
        </Button>
      </div>

      {/* LIST */}
      {data?.map((item) => (
        <Card key={item.id_materi} className='border shadow-sm'>
          <CardHeader className='flex justify-between items-center'>
            <h2 className='font-semibold text-lg'>{item.judul_materi}</h2>
            <div className='flex gap-2'>
              <Button
                size='sm'
                color='success'
                variant='flat'
                onPress={() => handleEdit(item)}>
                Edit
              </Button>
              <Button
                size='sm'
                color='danger'
                variant='flat'
                onPress={() => handleDelete(item.id_materi)}>
                Hapus
              </Button>
            </div>
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

      {/* MODAL */}
      <Modal isOpen={isOpen} onOpenChange={setIsOpen} size='lg'>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>
                <p className='text-xl font-semibold'>
                  {editingMateri ? 'Edit Materi' : 'Tambah Materi Baru'}
                </p>
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
                        isLoading={
                          createMutation.isPending || updateMutation.isPending
                        }>
                        {editingMateri ? 'Update' : 'Simpan'}
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
