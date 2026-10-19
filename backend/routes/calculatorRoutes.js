import express from 'express';
import { calculateSolarFeasibility } from '../controllers/calculatorController.js';

const router = express.Router();

/**
 * POST /api/calculator/calculate
 * Calculate kW system size, panel count, roof space, and 25-year financial savings
 */
router.post('/calculate', calculateSolarFeasibility);

export default router;
