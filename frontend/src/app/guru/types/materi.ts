export interface Materi {
  id_materi: number;
  judul_materi: string;
  deskripsi: string | null;
  file_materi: string | null;
  id_guru: number;
  createdAt: string;
  updatedAt: string;
}
