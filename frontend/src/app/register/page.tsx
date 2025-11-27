'use client';

import { useState, useEffect } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import {
  Button,
  Input,
  Card,
  CardBody,
  CardHeader,
  Divider,
} from '@heroui/react';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { useRouter } from 'next/navigation';

// Role yang tersedia
type Role = 'siswa' | 'guru';

// Interface untuk form data
interface SiswaForm {
  nama: string;
  username: string;
  password: string;
  kelas?: string;
  jurusan?: string;
}

interface GuruForm {
  nama: string;
  username: string;
  password: string;
  email?: string;
  mata_pelajaran?: string;
}

// Union type untuk form
type FormData = SiswaForm & GuruForm;

export default function RegisterModular() {
  const router = useRouter();
  const [role, setRole] = useState<Role>('siswa');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>();

  useEffect(() => {
    reset(); // menghapus semua field lama
  }, [role, reset]);

  const mutation = useMutation({
    mutationFn: async (data: FormData) => {
      const payload =
        role === 'siswa'
          ? {
              nama_siswa: data.nama,
              username: data.username,
              password: data.password,
              kelas: data.kelas,
              jurusan: data.jurusan,
            }
          : {
              nama_guru: data.nama,
              username: data.username,
              password: data.password,
              email: data.email,
              mata_pelajaran: data.mata_pelajaran,
            };
      const url =
        role === 'siswa'
          ? 'http://localhost:5000/api/siswa'
          : 'http://localhost:5000/api/guru';

      return axios.post(url, payload);
    },
    onSuccess: () => {
      alert(`${role === 'siswa' ? 'Siswa' : 'Guru'} berhasil didaftarkan!`);
      reset();
      router.push('/login');
    },
    onError: (err) => {
      alert(err.response?.data?.message || 'Terjadi kesalahan server');
    },
  });

  const onSubmit: SubmitHandler<FormData> = (data) => {
    mutation.mutate(data);
  };

  return (
    <Card className='max-w-md mx-auto mt-10 shadow-lg'>
      <CardHeader>
        <h2 className='text-xl font-bold'>
          Register {role === 'siswa' ? 'Siswa' : 'Guru'}
        </h2>
      </CardHeader>
      <Divider />
      <CardBody>
        <div className='mb-4'>
          <label>Daftar Sebagai</label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value as Role)}>
            <option value='siswa'>Siswa</option>
            <option value='guru'>Guru</option>
          </select>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-4'>
          <div>
            <label>Nama</label>
            <Input
              {...register('nama', { required: true })}
              placeholder='Nama Lengkap'
            />
            {errors.nama && (
              <span className='text-red-500 text-sm'>Nama wajib diisi</span>
            )}
          </div>

          <div>
            <label>Username</label>
            <Input
              {...register('username', { required: true })}
              placeholder='Username'
            />
            {errors.username && (
              <span className='text-red-500 text-sm'>Username wajib diisi</span>
            )}
          </div>

          <div>
            <label>Password</label>
            <Input
              type='password'
              {...register('password', { required: true, minLength: 4 })}
              placeholder='Password'
            />
            {errors.password && (
              <span className='text-red-500 text-sm'>
                Password minimal 4 karakter
              </span>
            )}
          </div>

          {role === 'siswa' && (
            <>
              <div>
                <label>Kelas</label>
                <Input
                  {...register('kelas', { required: true })}
                  placeholder='XII'
                />
                {errors.kelas && (
                  <span className='text-red-500 text-sm'>
                    Kelas wajib diisi
                  </span>
                )}
              </div>
              <div>
                <label>Jurusan</label>
                <Input
                  {...register('jurusan', { required: true })}
                  placeholder='RPL'
                />
                {errors.jurusan && (
                  <span className='text-red-500 text-sm'>
                    Jurusan wajib diisi
                  </span>
                )}
              </div>
            </>
          )}

          {role === 'guru' && (
            <>
              <div>
                <label>Email</label>
                <Input
                  {...register('email', { required: true })}
                  placeholder='email@example.com'
                />
                {errors.email && (
                  <span className='text-red-500 text-sm'>
                    Email wajib diisi
                  </span>
                )}
              </div>
              <div>
                <label>Mata Pelajaran</label>
                <Input
                  {...register('mata_pelajaran', { required: true })}
                  placeholder='RPL'
                />
                {errors.mata_pelajaran && (
                  <span className='text-red-500 text-sm'>
                    Mata Pelajaran wajib diisi
                  </span>
                )}
              </div>
            </>
          )}

          <Button color='primary' type='submit' loading={mutation.isLoading}>
            Daftar
          </Button>
        </form>
      </CardBody>
    </Card>
  );
}
