import express from 'express';
import {
  createMateri,
  getAllMateri,
  getMateriById,
  deleteMateri,
  updateMateri,
} from '../controllers/materiController.js';
import { uploadMateri } from '../middleware/multerMateri.js';

const router = express.Router();

router.post('/', uploadMateri.single('file_materi'), createMateri);
router.get('/', getAllMateri);
router.get('/:id', getMateriById);
router.delete('/:id', deleteMateri);
router.put('/:id', uploadMateri.single('file_materi'), updateMateri);

export default router;
