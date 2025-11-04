// routes/soalRoutes.js
import express from 'express';
import {
  getAllSoal,
  getSoalById,
  createSoal,
  updateSoal,
  deleteSoal,
} from '../controllers/soalController.js';

const router = express.Router();

router.get('/', getAllSoal);
router.get('/:id', getSoalById);
router.post('/', createSoal);
router.put('/:id', updateSoal);
router.delete('/:id', deleteSoal);

export default router;
