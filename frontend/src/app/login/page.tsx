'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
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

type LoginForm = {
  role: 'guru' | 'siswa';
  username: string;
  password: string;
};

export default function LoginPage() {
  const router = useRouter();
  const { register, handleSubmit, watch } = useForm<LoginForm>({
    defaultValues: { role: 'siswa' },
  });

  const [error, setError] = useState('');

  const loginMutation = useMutation({
    mutationFn: async (data: LoginForm) => {
      const endpoint =
        data.role === 'guru' ? 'api/auth/guru/login' : 'api/auth/siswa/login';
      const res = await axios.post(`http://localhost:5000/${endpoint}`, data);
      return res.data;
    },
    onSuccess: (data) => {
      localStorage.setItem('user', JSON.stringify(data.user));
      if (data.user.role === 'guru') router.push('/dashboard/guru');
      else router.push('/dashboard/siswa');
    },
    onError: (err: any) => {
      setError(err.response?.data?.message || 'Login gagal');
      console.log(err);
    },
  });

  const onSubmit = (data: LoginForm) => {
    setError('');
    loginMutation.mutate(data);
  };

  return (
    <div className='flex justify-center items-center h-screen'>
      <Card className='w-[400px] shadow-md'>
        <CardHeader className='text-center text-2xl font-semibold'>
          Portal Login
        </CardHeader>
        <Divider />
        <CardBody>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className='flex flex-col gap-4'>
            <div className='flex justify-between'>
              <label className='text-sm font-medium'>Login sebagai:</label>
              <select
                {...register('role')}
                className='border rounded px-2 py-1 text-sm'>
                <option value='siswa'>Siswa</option>
                <option value='guru'>Guru</option>
              </select>
            </div>

            <Input
              label='Username'
              variant='bordered'
              {...register('username', { required: true })}
            />
            <Input
              label='Password'
              type='password'
              variant='bordered'
              {...register('password', { required: true })}
            />

            {error && <p className='text-red-500 text-sm'>{error}</p>}

            <Button
              color='primary'
              type='submit'
              isLoading={loginMutation.isPending}>
              Login
            </Button>
          </form>
        </CardBody>
      </Card>
    </div>
  );
}
