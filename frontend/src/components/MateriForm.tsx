'use client';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Input, Textarea } from '@heroui/react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/app/lib/api';

const materiSchema = z.object({
  judul_materi: z.string().min(3, 'Judul minimal 3 karakter'),
  deskripsi: z.string().min(5, 'Deskripsi terlalu singkat'),
  file_materi: z.string().optional(),
});

type MateriFormValues = z.infer<typeof materiSchema>;

export default function MateriForm({ id_guru }: { id_guru: number }) {
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<MateriFormValues>({ resolver: zodResolver(materiSchema) });

  const mutation = useMutation({
    mutationFn: async (data: MateriFormValues) => {
      const res = await api.post('/materi', { ...data, id_guru });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['materi', id_guru] });
      reset();
    },
  });

  const onSubmit = (data: MateriFormValues) => mutation.mutate(data);

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className='bg-white shadow p-6 rounded-xl space-y-4'>
      <h2 className='text-xl font-semibold text-gray-700'>Tambah Materi</h2>
      <Input
        label='Judul Materi'
        {...register('judul_materi')}
        isInvalid={!!errors.judul_materi}
        errorMessage={errors.judul_materi?.message}
      />
      <Textarea
        label='Deskripsi'
        {...register('deskripsi')}
        isInvalid={!!errors.deskripsi}
        errorMessage={errors.deskripsi?.message}
      />
      <Input
        label='File Materi (path)'
        placeholder='uploads/struktur-data.pdf'
        {...register('file_materi')}
      />
      <Button type='submit' color='primary' isLoading={isSubmitting}>
        Simpan Materi
      </Button>
    </form>
  );
}
