'use client';

import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Avatar,
  Button,
} from '@heroui/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface User {
  id: number;
  nama: string;
  role: string;
}

export default function NavbarApp() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (stored) setUser(JSON.parse(stored));
  }, []);

  const logout = () => {
    localStorage.removeItem('user');
    router.push('/login');
  };

  return (
    <Navbar isBordered maxWidth='full' className='px-6'>
      {/* ========================== */}
      {/*   KIRI                    */}
      {/* ========================== */}
      <NavbarBrand>
        <p className='font-bold text-xl text-blue-600'>
          {user ? (
            <>Dashboard {user.role === 'guru' ? 'Guru' : 'Siswa'}</>
          ) : (
            'Aplikasi Pembelajaran SMK Ganesa Satria 2'
          )}
        </p>
      </NavbarBrand>

      {/* Spacer biar tengah gak mepet */}
      <NavbarContent className='flex-1' />

      {/* ========================== */}
      {/*   TENGAH                   */}
      {/* ========================== */}
      {user && (
        <NavbarContent className='hidden sm:flex'>
          <h1 className='font-semibold text-lg text-gray-700'>
            Halo, {user.nama}
          </h1>
        </NavbarContent>
      )}

      {/* ========================== */}
      {/*   KANAN                    */}
      {/* ========================== */}
      <NavbarContent justify='end'>
        {/* Jika BELUM login */}
        {!user && (
          <div className='flex gap-3'>
            <Button
              variant='flat'
              color='primary'
              onPress={() => router.push('/login')}>
              Login
            </Button>

            <Button
              variant='ghost'
              color='primary'
              onPress={() => router.push('/register')}>
              Register
            </Button>
          </div>
        )}

        {/* Jika SUDAH login */}
        {user && (
          <Dropdown placement='bottom-end'>
            <DropdownTrigger>
              <Avatar
                as='button'
                className='transition-transform'
                name={user.nama}
                size='md'
              />
            </DropdownTrigger>

            <DropdownMenu aria-label='Profil User'>
              <DropdownItem key='profile' className='h-14 gap-2'>
                <p className='font-semibold'>Hai, {user.nama}</p>
                <p className='text-gray-600 text-sm'>Role: {user.role}</p>
              </DropdownItem>

              <DropdownItem key='logout' color='danger' onPress={logout}>
                Logout
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        )}
      </NavbarContent>
    </Navbar>
  );
}
