'use client';
import { Button } from '@heroui/react';
import { BookOpen, FileEdit, ClipboardList, Settings } from 'lucide-react';
import GuruDashboardCard from '@/components/GuruDashboardCard';
import { useRouter } from 'next/navigation';

export default function GuruDashboardPage() {
  const router = useRouter();

  return (
    <main className='min-h-screen bg-gradient-to-br from-blue-50 to-white px-8 py-10'>
      <header className='flex justify-between items-center mb-10'>
        <h1 className='text-3xl font-bold text-gray-800'>Dashboard Guru</h1>
        <Button color='danger' onPress={() => router.push('/login')}>
          Logout
        </Button>
      </header>

      <section>
        <h2 className='text-xl font-semibold mb-6 text-gray-700'>Menu Utama</h2>
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6'>
          <GuruDashboardCard
            title='Buat Materi'
            icon={<BookOpen />}
            href='/guru/materi'
          />
          <GuruDashboardCard
            title='Buat Soal'
            icon={<FileEdit />}
            href='/guru/soal'
          />
          <GuruDashboardCard
            title='Lihat Nilai'
            icon={<ClipboardList />}
            href='/guru/nilai'
          />
          <GuruDashboardCard
            title='Pengaturan'
            icon={<Settings />}
            href='/guru/pengaturan'
          />
        </div>
      </section>
    </main>
  );
}
