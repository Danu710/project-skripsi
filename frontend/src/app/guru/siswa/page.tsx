'use client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/app/lib/api';
import { Card, CardHeader, CardBody, CardFooter } from '@heroui/card';
import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalFooter,
  useDisclosure,
} from '@heroui/react';
import React, { useState } from 'react';

interface Siswa {
  id_siswa: number;
  nama_siswa: string;
  username: string;
  password: string;
  kelas: string;
  jurusan: string;
  createdAt: string;
  updatedAt: string;
}

export default function GuruSiswaPage() {
  const queryClient = useQueryClient();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedSiswa, setSelectedSiswa] = useState<Siswa | null>(null);
  const [form, setForm] = useState({ nama_siswa: '', kelas: '', jurusan: '' });

  const { data, isLoading, isError } = useQuery<Siswa[]>({
    queryKey: ['get-siswa'],
    queryFn: async () =>
      (await api.get('http://localhost:5000/api/siswa')).data,
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) =>
      await api.delete(`http://localhost:5000/api/siswa/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['get-siswa'] }),
  });

  const editMutation = useMutation({
    mutationFn: async (siswa: Siswa) =>
      await api.put(`http://localhost:5000/api/siswa/${siswa.id_siswa}`, siswa),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['get-siswa'] });
      onClose();
    },
  });

  const handleEditClick = (s: Siswa) => {
    setSelectedSiswa(s);
    setForm({ nama_siswa: s.nama_siswa, kelas: s.kelas, jurusan: s.jurusan });
    onOpen();
  };

  const handleSubmit = () => {
    if (!selectedSiswa) return;
    editMutation.mutate({ ...selectedSiswa, ...form });
  };

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Error fetching data</p>;

  return (
    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4'>
      {data?.map((s) => (
        <Card key={s.id_siswa}>
          <CardHeader>
            <h2 className='text-lg font-bold'>{s.nama_siswa}</h2>
          </CardHeader>
          <CardBody>
            <p>
              <strong>Username:</strong> {s.username}
            </p>
            <p>
              <strong>Kelas:</strong> {s.kelas}
            </p>
            <p>
              <strong>Jurusan:</strong> {s.jurusan}
            </p>
            <p>
              <strong>Created:</strong>{' '}
              {new Date(s.createdAt).toLocaleDateString()}
            </p>
          </CardBody>
          <CardFooter className='flex gap-2'>
            <Button color='primary' onClick={() => handleEditClick(s)}>
              Edit
            </Button>
            <Button
              color='danger'
              onClick={() => deleteMutation.mutate(s.id_siswa)}>
              Delete
            </Button>
          </CardFooter>
        </Card>
      ))}

      {/* Modal Edit */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalContent>
          <ModalHeader>Edit Siswa</ModalHeader>
          <ModalBody className='flex flex-col gap-2'>
            <Input
              label='Nama'
              value={form.nama_siswa}
              onChange={(e) => setForm({ ...form, nama_siswa: e.target.value })}
            />
            <Input
              label='Kelas'
              value={form.kelas}
              onChange={(e) => setForm({ ...form, kelas: e.target.value })}
            />
            <Input
              label='Jurusan'
              value={form.jurusan}
              onChange={(e) => setForm({ ...form, jurusan: e.target.value })}
            />
          </ModalBody>
          <ModalFooter className='flex gap-2'>
            <Button color='primary' onClick={handleSubmit}>
              Save
            </Button>
            <Button color='secondary' onClick={onClose}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}
