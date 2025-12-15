import express from 'express';
import {
  createUjian,
  getAllUjian,
  getUjianById,
  deleteUjian,
  updateUjian,
} from '../controllers/ujianController.js';
import {
  mulaiUjian,
  statusUjian,
  selesaiUjian,
} from '../controllers/handlerOpenMateriController.js';

const router = express.Router();

router.post('/', createUjian);
router.get('/', getAllUjian);
router.get('/:id_ujian', getUjianById);
router.delete('/:id_ujian', deleteUjian);
router.put('/:id_ujian', updateUjian);
router.post('/mulai', mulaiUjian);
router.get('/status/:id', statusUjian);
router.post('/selesai', selesaiUjian);

export default router;
