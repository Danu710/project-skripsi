'use client';
import { Button } from '@heroui/react';
import { BookOpen, FileEdit, ClipboardList, FileQuestion } from 'lucide-react';

import { useRouter } from 'next/navigation';
import SiswaDashboardCard from '@/components/SiswaDashboardCard';

export default function GuruDashboardPage() {
  const router = useRouter();

  return (
    <main className='min-h-screen bg-gradient-to-br from-blue-50 to-white px-8 py-10'>
      <header className='flex justify-between items-center mb-10'>
        <h1 className='text-3xl font-bold text-gray-800'>Dashboard Siswa</h1>
        <Button
          color='danger'
          onPress={() => {
            localStorage.removeItem('user');
            router.push('/login');
          }}>
          Logout
        </Button>
      </header>

      <section>
        <h2 className='text-xl font-semibold mb-6 text-gray-700'>Menu Utama</h2>
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6'>
          <SiswaDashboardCard
            title='Materi'
            icon={<BookOpen />}
            href='/siswa/materi'
          />
          <SiswaDashboardCard
            title='Ujian'
            icon={<FileQuestion />}
            href='/siswa/ujian'
          />

          <SiswaDashboardCard
            title='Nilai'
            icon={<ClipboardList />}
            href='/siswa/nilai'
          />
        </div>
      </section>
    </main>
  );
}
