export interface SawItem {
  id_siswa: number;
  nama_siswa: string;
  total_nilai: number | null;
  ranking: number;
}

export interface SawSuccessResponse {
  message: string;
  data: SawItem[];
}

export interface SawEmptyResponse {
  message: 'Belum ada hasil SAW untuk ujian ini';
}

export type SawApiResponse = SawSuccessResponse | SawEmptyResponse;

// Untuk frontend setelah diproses
export interface SawProcessed {
  empty: boolean;
  data: SawItem[];
}
