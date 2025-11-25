import express from 'express';
import {
  getHasilSAW,
  prosesSAW,
  hitungNilaiSiswa,
  resetSAW,
} from '../controllers/sawController.js';

const router = express.Router();

router.get('/:id_ujian', getHasilSAW);
router.post('/proses', prosesSAW);
router.post('/hitung-nilai', hitungNilaiSiswa);

router.delete('/reset/:id_ujian', resetSAW);

export default router;
