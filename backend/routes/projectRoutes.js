import express from 'express';
import { getProjects, getProjectById } from '../controllers/projectController.js';

const router = express.Router();

/**
 * GET /api/projects     -> Returns all portfolio projects
 * GET /api/projects/:id -> Returns a single project by ID
 */
router.get('/', getProjects);
router.get('/:id', getProjectById);

export default router;
