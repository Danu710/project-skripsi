import express from 'express';
import {
  createUjian,
  getAllUjian,
  getUjianById,
  deleteUjian,
  updateUjian,
} from '../controllers/ujianController.js';

const router = express.Router();

router.post('/', createUjian);
router.get('/', getAllUjian);
router.get('/:id_ujian', getUjianById);
router.delete('/:id_ujian', deleteUjian);
router.put('/:id_ujian', updateUjian);

export default router;
