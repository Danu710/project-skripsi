'use client';

import { useQuery } from '@tanstack/react-query';
import { apiSiswa, api } from '@/app/lib/api';
import { useState, useEffect } from 'react';
import { Button, RadioGroup, Radio } from '@heroui/react';
import { useParams, useRouter } from 'next/navigation';

export interface Root2 {
  id_soal: number;
  id_ujian: number;
  id_kriteria: number;
  pertanyaan: string;
  opsi_a: string;
  opsi_b: string;
  opsi_c: string;
  opsi_d: string;
  jawaban_benar: string;
  createdAt: string;
  updatedAt: string;
  Ujian: Ujian;
}

export interface Ujian {
  id_ujian: number;
  nama_ujian: string;
  tanggal_ujian: string;
  durasi: number;
}

export default function SoalPage() {
  const { id } = useParams(); // id_ujian dari URL
  const id_ujian = Number(id);
  const router = useRouter();

  const [jawaban, setJawaban] = useState<Record<number, string>>({});
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [timerStarted, setTimerStarted] = useState(false);
  const user =
    typeof window !== 'undefined'
      ? JSON.parse(localStorage.getItem('user') || '{}')
      : {};

  const { data: ujian } = useQuery({
    queryKey: ['ujian-by-id', id],
    queryFn: async () => {
      const res = await api.get(`/ujian/${id}`);
      return res.data;
    },
  });

  // Ambil semua soal
  const { data, isLoading, isError } = useQuery({
    queryKey: ['get-soal'],
    queryFn: () => apiSiswa.get('/soal'),
  });

  const soalUjian = data?.filter((item: Root2) => item.id_ujian === id_ujian);

  const handleSubmit = async () => {
    const id_siswa = user.id; // contoh, ini nanti kamu ambil dari session/login

    for (const id_soal in jawaban) {
      await apiSiswa.post('/jawaban', {
        id_soal: Number(id_soal),
        id_ujian,
        id_siswa,
        jawaban_text: jawaban[id_soal],
      });
    }

    // 2. Tandai ujian selesai
    await api.post('/ujian/selesai', {
      id_siswa,
    });

    alert('Jawaban berhasil dikirim!');
    router.push('/dashboard/siswa');
  };

  //check status ujian siswa
  useEffect(() => {
    const checkStatus = async () => {
      const res = await api.get(`/ujian/status/${user.id}`);

      if (!res.data.sedang_ujian || res.data.id_ujian_aktif !== id_ujian) {
        alert('Anda tidak memiliki akses ke ujian ini');
        router.replace('/siswa/ujian');
      }
    };

    checkStatus();
  }, []);

  // Set timer sesuai durasi ujian
  useEffect(() => {
    if (!ujian) return;

    const totalDetik = ujian.durasi * 60;
    setTimeLeft(totalDetik);
    setTimerStarted(true);
  }, [ujian]);

  // Countdown timer
  useEffect(() => {
    if (!timerStarted) return;
    if (ujian == null) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [timerStarted]);

  // Auto submit hanya jika timer sudah dimulai
  useEffect(() => {
    if (!timerStarted) return;
    if (timeLeft === 0) handleSubmit();
  }, [timeLeft, timerStarted]);

  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  if (isLoading) return <p className='p-5'>Loading soal...</p>;
  if (isError)
    return <p className='p-5 text-red-600'>Gagal memuat data soal.</p>;

  return (
    <div className='p-10 space-y-8'>
      <h1 className='text-2xl font-bold text-gray-800'>Soal Tes</h1>
      <div className='text-right text-xl text-red-600 font-bold'>
        Sisa Waktu: {formatTime(timeLeft)}
      </div>

      {soalUjian?.map((soal: Root2, index: number) => (
        <div
          key={soal.id_soal}
          className='bg-white p-6 rounded-xl shadow border'>
          <h2 className='text-lg font-semibold text-gray-800'>
            {index + 1}. {soal.pertanyaan}
          </h2>

          <RadioGroup
            label='Pilih Jawaban:'
            value={jawaban[soal.id_soal] || ''}
            onValueChange={(val) =>
              setJawaban((prev) => ({ ...prev, [soal.id_soal]: val }))
            }
            className='mt-3'>
            <Radio value='A'>{soal.opsi_a}</Radio>
            <Radio value='B'>{soal.opsi_b}</Radio>
            <Radio value='C'>{soal.opsi_c}</Radio>
            <Radio value='D'>{soal.opsi_d}</Radio>
          </RadioGroup>
        </div>
      ))}

      {soalUjian?.length > 0 && (
        <Button color='primary' size='lg' onPress={handleSubmit}>
          Submit Jawaban
        </Button>
      )}
    </div>
  );
}
