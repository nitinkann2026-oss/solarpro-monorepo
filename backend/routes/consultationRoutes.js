import express from 'express';
import {
  createConsultation,
  getAllConsultations,
  getConsultationById,
  updateConsultation,
  updateConsultationStatus,
  deleteConsultation
} from '../controllers/consultationController.js';

/**
 * --------------------------------------------------------------------------
 * CONSULTATION ROUTES
 * --------------------------------------------------------------------------
 */

const router = express.Router();

// POST /api/consultations -> Submit a new consultation / quote request
// GET  /api/consultations -> Retrieve all requests
router.route('/')
  .post(createConsultation)
  .get(getAllConsultations);

// GET    /api/consultations/:id -> Retrieve a single request by Ticket Number or ID
// PUT    /api/consultations/:id -> Update any lead details
// DELETE /api/consultations/:id -> Delete a request
router.route('/:id')
  .get(getConsultationById)
  .put(updateConsultation)
  .delete(deleteConsultation);

// PUT /api/consultations/:id/status -> Update status (pending, contacted, etc.)
router.route('/:id/status')
  .put(updateConsultationStatus);

export default router;
