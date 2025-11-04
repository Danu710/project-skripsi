'use client';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/app/lib/queryClient';
import MateriForm from '@/components/MateriForm';
import MateriList from '@/components/MateriList';

export default function MateriPage() {
  const id_guru = 5; // sementara hardcode, nanti ambil dari session/login

  return (
    <QueryClientProvider client={queryClient}>
      <main className='min-h-screen bg-gradient-to-br from-white to-blue-50 p-10 space-y-8'>
        <h1 className='text-3xl font-bold text-gray-800 mb-4'>Kelola Materi</h1>
        <MateriForm id_guru={id_guru} />
        <MateriList id_guru={id_guru} />
      </main>
    </QueryClientProvider>
  );
}
