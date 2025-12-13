'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/context/AuthContext';

export default function GuruLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // belum login atau role bukan guru
    if (!user || user.role !== 'guru') {
      router.replace('/login');
    }
  }, [user, router]);

  // cegah flicker
  if (!user || user.role !== 'guru') return null;

  return <>{children}</>;
}
