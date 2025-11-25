import express from 'express';
import {
  createUjian,
  getAllUjian,
  getUjianById,
} from '../controllers/ujianController.js';

const router = express.Router();

router.post('/', createUjian);
router.get('/', getAllUjian);
router.get('/:id_ujian', getUjianById);

export default router;
