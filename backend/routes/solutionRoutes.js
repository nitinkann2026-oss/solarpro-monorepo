import express from 'express';
import { getSolutions, getSolutionById } from '../controllers/solutionController.js';

const router = express.Router();

/**
 * GET /api/solutions     -> Returns all solar solutions
 * GET /api/solutions/:id -> Returns a single solution by ID
 */
router.get('/', getSolutions);
router.get('/:id', getSolutionById);

export default router;
