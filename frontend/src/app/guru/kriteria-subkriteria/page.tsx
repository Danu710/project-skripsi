'use client';

import { useQuery } from '@tanstack/react-query';
import { api } from '@/app/lib/api';
import React from 'react';

export interface Kriteria {
  id_kriteria: number;
  kode: string;
  nama_kriteria: string;
  tipe: 'benefit' | 'cost' | string;
  bobot: number;
  createdAt: string;
  updatedAt: string;
}

export interface Kriterium /* relasi pada subkriteria */ {
  id_kriteria: number;
  kode: string;
  nama_kriteria: string;
  tipe: 'benefit' | 'cost' | string;
  bobot: number;
  createdAt: string;
  updatedAt: string;
}

export interface Subkriteria {
  id_subkriteria: number;
  id_kriteria: number;
  nama_subkriteria: string;
  nilai: number;
  createdAt: string;
  updatedAt: string;
  Kriterium?: Kriterium | null;
}

export default function KriteriaSubkriteriaPage(): JSX.Element {
  // fetch kriteria
  const {
    data: kriteria,
    isLoading: loadingKriteria,
    isError: errorKriteria,
    error: errKriteriaObj,
  } = useQuery<Kriteria[]>({
    queryKey: ['kriteria'],
    queryFn: async () => {
      const res = await api.get('http://localhost:5000/api/kriteria');
      // backend mengembalikan { success: true, data: [...] }
      return res.data.data as Kriteria[];
    },
  });

  // fetch subkriteria
  const {
    data: subkriteria,
    isLoading: loadingSub,
    isError: errorSub,
    error: errSubObj,
  } = useQuery<Subkriteria[]>({
    queryKey: ['subkriteria'],
    queryFn: async () => {
      const res = await api.get('http://localhost:5000/api/subkriteria');
      return res.data.data as Subkriteria[];
    },
  });

  const loading = loadingKriteria || loadingSub;
  const isError = errorKriteria || errorSub;

  return (
    <div className='p-10'>
      <h1 className='text-2xl font-bold text-gray-700 mb-5 text-center'>
        Halaman Kriteria & Subkriteria
      </h1>

      {loading && (
        <div className='text-center text-gray-600 p-6'>Memuat data...</div>
      )}

      {isError && (
        <div className='text-center text-red-600 p-6'>
          Terjadi kesalahan saat memuat data.
          <div className='mt-2 text-sm text-gray-500'>
            {/* show small debug info if available */}
            {errKriteriaObj && errKriteriaObj.message && (
              <div>Kriteria error: {errKriteriaObj.message}</div>
            )}
            {errSubObj && errSubObj.message && (
              <div>Subkriteria error: {errSubObj.message}</div>
            )}
          </div>
        </div>
      )}

      {!loading && !isError && (
        <>
          {/* TABEL KRITERIA */}
          <div className='mb-10'>
            <h2 className='text-xl font-semibold mb-3 text-gray-700'>
              Data Kriteria
            </h2>

            <div className='overflow-x-auto'>
              <table className='w-full border border-gray-300'>
                <thead className='bg-gray-200'>
                  <tr>
                    <th className='p-2 border text-left'>Kode</th>
                    <th className='p-2 border text-left'>Nama Kriteria</th>
                    <th className='p-2 border text-center'>Tipe</th>
                    <th className='p-2 border text-right'>Bobot</th>
                  </tr>
                </thead>
                <tbody>
                  {kriteria && kriteria.length > 0 ? (
                    kriteria.map((item) => (
                      <tr key={item.id_kriteria}>
                        <td className='p-2 border text-left'>{item.kode}</td>
                        <td className='p-2 border text-left'>
                          {item.nama_kriteria}
                        </td>
                        <td className='p-2 border text-center'>{item.tipe}</td>
                        <td className='p-2 border text-right'>{item.bobot}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td className='p-4 border text-center' colSpan={4}>
                        Tidak ada data kriteria
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* TABEL SUBKRITERIA */}
          <div>
            <h2 className='text-xl font-semibold mb-3 text-gray-700'>
              Data Subkriteria
            </h2>

            <div className='overflow-x-auto'>
              <table className='w-full border border-gray-300'>
                <thead className='bg-gray-200'>
                  <tr>
                    <th className='p-2 border text-left'>Kriteria</th>
                    <th className='p-2 border text-left'>Subkriteria</th>
                    <th className='p-2 border text-center'>Nilai</th>
                  </tr>
                </thead>
                <tbody>
                  {subkriteria && subkriteria.length > 0 ? (
                    subkriteria.map((item) => (
                      <tr key={item.id_subkriteria}>
                        <td className='p-2 border'>
                          {item.Kriterium
                            ? `${item.Kriterium.kode} - ${item.Kriterium.nama_kriteria}`
                            : `Kriteria ID ${item.id_kriteria}`}
                        </td>
                        <td className='p-2 border'>{item.nama_subkriteria}</td>
                        <td className='p-2 border text-center'>{item.nilai}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td className='p-4 border text-center' colSpan={3}>
                        Tidak ada data subkriteria
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
