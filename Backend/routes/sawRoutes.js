import express from 'express';
import {
  getHasilSAW,
  prosesSAW,
  hitungNilaiSiswa,
  resetSAW,
  cetakHasilSAWPDF,
} from '../controllers/sawController.js';

const router = express.Router();

router.get('/:id_ujian', getHasilSAW);
router.get('/cetak-pdf/:id_ujian', cetakHasilSAWPDF);
router.post('/proses', prosesSAW);
router.post('/hitung-nilai', hitungNilaiSiswa);

router.delete('/reset/:id_ujian', resetSAW);

export default router;
