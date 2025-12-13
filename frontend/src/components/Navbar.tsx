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
import Link from 'next/link';
import { useAuth } from '@/app/context/AuthContext';
import { useRouter } from 'next/navigation';

export default function NavbarApp() {
  const router = useRouter();

  const { user, logout } = useAuth();

  return (
    <Navbar isBordered maxWidth='full' className='px-6'>
      {/* ========================== */}
      {/*   KIRI                    */}
      {/* ========================== */}
      <NavbarBrand>
        {user ? (
          <Link
            href={user.role === 'guru' ? '/dashboard/guru' : '/dashboard/siswa'}
            className='font-bold text-xl text-blue-600'>
            Dashboard {user.role === 'guru' ? 'Guru' : 'Siswa'}
          </Link>
        ) : (
          <Link href='/login' className='font-bold text-xl text-blue-600'>
            Aplikasi Pembelajaran SMK Ganesa Satria 2
          </Link>
        )}
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
