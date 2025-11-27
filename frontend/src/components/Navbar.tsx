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
      {/* Kiri */}
      <NavbarBrand>
        <p className='font-bold text-xl text-blue-600'>
          Dashboard {user?.role === 'guru' ? 'Guru' : 'Siswa'}
        </p>
      </NavbarBrand>

      {/* Spacer agar posisi tengah tidak terlalu jauh */}
      <NavbarContent className='flex-1' />

      {/* Tengah */}
      <NavbarContent className='hidden sm:flex'>
        <h1 className='font-semibold text-lg text-gray-700'>
          Halo, {user?.nama || 'User'}
        </h1>
      </NavbarContent>

      {/* Kanan */}
      <NavbarContent justify='end'>
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
