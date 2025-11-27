'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { HeroUIProvider } from '@heroui/react';
import './globals.css';
import { useState } from 'react';
import NavbarApp from '@/components/Navbar';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <html lang='id'>
      <body className='bg-gray-50'>
        <HeroUIProvider>
          <QueryClientProvider client={queryClient}>
            <NavbarApp />
            {children}
          </QueryClientProvider>
        </HeroUIProvider>
      </body>
    </html>
  );
}
