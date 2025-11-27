'use client';

import { BookOpen, FileQuestion } from 'lucide-react';
import SiswaDashboardCard from '@/components/SiswaDashboardCard';
import NavbarApp from '@/components/Navbar';

export default function DashboardSiswaPage() {
  return (
    <>
      <NavbarApp />
      <main className='min-h-screen bg-gradient-to-br from-blue-50 to-white '>
        {/* ================= CONTENT ================= */}
        <section className='mt-10 px-10'>
          <h2 className='text-xl font-semibold mb-6 text-gray-700'>
            Menu Utama
          </h2>

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
          </div>
        </section>
      </main>
    </>
  );
}
