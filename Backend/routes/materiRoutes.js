import express from 'express';
import { createMateri, getAllMateri } from '../controllers/materiController.js';

const router = express.Router();

router.post('/', createMateri);
router.get('/', getAllMateri);

export default router;
