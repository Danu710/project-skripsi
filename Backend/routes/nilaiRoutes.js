// routes/nilaiRoutes.js
import express from 'express';
import {
  createNilai,
  getAllNilai,
  getNilaiById,
  updateNilai,
  deleteNilai,
} from '../controllers/nilaiController.js';

const router = express.Router();

router.post('/', createNilai);
router.get('/', getAllNilai);
router.get('/:id', getNilaiById);
router.put('/:id', updateNilai);
router.delete('/:id', deleteNilai);

export default router;
