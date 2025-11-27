import multer from 'multer';
import path from 'path';

// Tentukan lokasi simpan file
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/materi/');
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueName + path.extname(file.originalname));
  },
});

// Filter jenis file (opsional)
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['.pdf', '.docx', '.jpg', '.png'];
  const ext = path.extname(file.originalname).toLowerCase();

  if (!allowedTypes.includes(ext)) {
    return cb(new Error('File tidak didukung'), false);
  }
  cb(null, true);
};

export const uploadMateri = multer({
  storage,
  fileFilter,
});
