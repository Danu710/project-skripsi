import express from 'express';
import {
  getAllKriteria,
  getKriteriaById,
  createKriteria,
  updateKriteria,
  deleteKriteria,
} from '../controllers/kriteriaController.js';

const router = express.Router();

router.get('/', getAllKriteria);
router.get('/:id', getKriteriaById);
router.post('/', createKriteria);
router.put('/:id', updateKriteria);
router.delete('/:id', deleteKriteria);

export default router;
