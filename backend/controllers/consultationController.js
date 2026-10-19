import Consultation from '../models/Consultation.js';
import { isMongoConnected } from '../config/db.js';
import { localStore } from '../data/storage.js';

/**
 * --------------------------------------------------------------------------
 * CONSULTATION CONTROLLER (BUSINESS LOGIC)
 * --------------------------------------------------------------------------
 * What is a Controller?
 * - In Express / MVC (Model-View-Controller) architecture:
 *   1. Routes decide WHICH function handles a URL request (e.g. POST /api/consultations).
 *   2. Controllers contain the actual BRAIN / LOGIC of what happens:
 *      - Extract data from the incoming request (req.body, req.params).
 *      - Validate the inputs (check for missing required fields).
 *      - Interact with the database (MongoDB or local store).
 *      - Send back a clean HTTP response with a status code (res.status(...).json(...)).
 */

// Helper to generate a clean 6-digit ticket ID
const generateTicketNumber = () => {
  const randomNum = Math.floor(100000 + Math.random() * 900000);
  return `SOLAR-REQ-#${randomNum}`;
};

/**
 * @desc    Submit a new solar quote / engineering consultation request
 * @route   POST /api/consultations
 * @access  Public (Called when user submits the contact form in React)
 */
export const createConsultation = async (req, res) => {
  try {
    const { fullName, phone, email, propertyType, monthlyBill, notes, calculatorEstimate } = req.body;

    // 1. Basic validation: ensure vital contact points are provided
    if (!fullName || !phone || !email) {
      return res.status(400).json({
        success: false,
        message: 'Please provide full name, phone number, and email address.'
      });
    }

    // 2. Generate an official reference ticket code
    const ticketNumber = generateTicketNumber();

    const consultationData = {
      fullName: fullName.trim(),
      phone: phone.trim(),
      email: email.trim().toLowerCase(),
      propertyType: propertyType || 'Residential Rooftop',
      monthlyBill: monthlyBill || '$200 - $500',
      notes: notes ? notes.trim() : '',
      ticketNumber,
      status: 'pending',
      calculatorEstimate: calculatorEstimate || null,
      createdAt: new Date().toISOString()
    };

    let savedConsultation;

    // 3. Save to MongoDB if connected; otherwise save to local JSON file
    if (isMongoConnected) {
      savedConsultation = await Consultation.create(consultationData);
    } else {
      // Local fallback mode: assign a synthetic ID and save
      consultationData._id = 'local_' + Date.now();
      savedConsultation = localStore.saveConsultation(consultationData);
    }

    console.log(`\x1b[32m✔ New Consultation Request Received: ${ticketNumber} (${fullName})\x1b[0m`);

    // 4. Return HTTP 201 (Created) with the full saved document & reference ticket
    return res.status(201).json({
      success: true,
      message: 'Consultation request submitted successfully! An engineer will review your site feasibility.',
      ticketNumber,
      data: savedConsultation
    });
  } catch (error) {
    console.error('Error creating consultation:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Server error while processing your request. Please try again.',
      error: error.message
    });
  }
};

/**
 * @desc    Get all consultation requests (useful for admin or review)
 * @route   GET /api/consultations
 * @access  Public / Admin
 */
export const getAllConsultations = async (req, res) => {
  try {
    let consultations;

    if (isMongoConnected) {
      consultations = await Consultation.find().sort({ createdAt: -1 });
    } else {
      consultations = localStore.getConsultations();
    }

    return res.status(200).json({
      success: true,
      count: consultations.length,
      storageMode: isMongoConnected ? 'MongoDB' : 'Local JSON Storage',
      data: consultations
    });
  } catch (error) {
    console.error('Error fetching consultations:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Server error fetching consultations.',
      error: error.message
    });
  }
};

/**
 * @desc    Get a single consultation by ticket number or MongoDB ID
 * @route   GET /api/consultations/:id
 * @access  Public
 */
export const getConsultationById = async (req, res) => {
  try {
    const { id } = req.params;
    let consultation = null;

    if (isMongoConnected) {
      // Search by ticketNumber first, or by MongoDB _id
      if (id.startsWith('SOLAR-REQ-')) {
        consultation = await Consultation.findOne({ ticketNumber: id });
      } else {
        consultation = await Consultation.findById(id).catch(() => null);
      }
    } else {
      consultation = localStore.findConsultation(id);
    }

    if (!consultation) {
      return res.status(404).json({
        success: false,
        message: `Consultation request with identifier "${id}" was not found.`
      });
    }

    return res.status(200).json({
      success: true,
      data: consultation
    });
  } catch (error) {
    console.error('Error fetching single consultation:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Server error retrieving consultation.',
      error: error.message
    });
  }
};

/**
 * @desc    Update any fields of a consultation (Edit Lead Details)
 * @route   PUT /api/consultations/:id
 * @access  Admin
 */
export const updateConsultation = async (req, res) => {
  try {
    const { id } = req.params;
    const { fullName, phone, email, propertyType, monthlyBill, notes, status } = req.body;

    const updateFields = {};
    if (fullName !== undefined) updateFields.fullName = fullName.trim();
    if (phone !== undefined) updateFields.phone = phone.trim();
    if (email !== undefined) updateFields.email = email.trim().toLowerCase();
    if (propertyType !== undefined) updateFields.propertyType = propertyType;
    if (monthlyBill !== undefined) updateFields.monthlyBill = monthlyBill;
    if (notes !== undefined) updateFields.notes = notes ? notes.trim() : '';
    if (status !== undefined) updateFields.status = status;

    let updated = null;

    if (isMongoConnected) {
      if (id.startsWith('SOLAR-REQ-')) {
        updated = await Consultation.findOneAndUpdate(
          { ticketNumber: id },
          { $set: updateFields },
          { new: true }
        );
      } else {
        updated = await Consultation.findByIdAndUpdate(
          id,
          { $set: updateFields },
          { new: true }
        );
      }
    } else {
      updated = localStore.updateConsultation(id, updateFields);
    }

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: `Consultation with ID "${id}" was not found.`
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Lead updated successfully',
      data: updated
    });
  } catch (error) {
    console.error('Error updating consultation:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Server error updating consultation.',
      error: error.message
    });
  }
};

/**
 * @desc    Update consultation status (e.g. pending -> contacted -> completed)
 * @route   PUT /api/consultations/:id/status
 * @access  Admin
 */
export const updateConsultationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['pending', 'approved', 'rejected', 'contacted', 'scheduled', 'completed', 'cancelled'];
    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Must be one of: ${validStatuses.join(', ')}`
      });
    }

    let updated = null;

    if (isMongoConnected) {
      if (id.startsWith('SOLAR-REQ-')) {
        updated = await Consultation.findOneAndUpdate(
          { ticketNumber: id },
          { status },
          { new: true }
        );
      } else {
        updated = await Consultation.findByIdAndUpdate(
          id,
          { status },
          { new: true }
        );
      }
    } else {
      updated = localStore.updateStatus(id, status);
    }

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: `Consultation with ID "${id}" was not found.`
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Status updated successfully',
      data: updated
    });
  } catch (error) {
    console.error('Error updating status:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Server error updating status.',
      error: error.message
    });
  }
};

/**
 * @desc    Delete a consultation lead
 * @route   DELETE /api/consultations/:id
 * @access  Admin
 */
export const deleteConsultation = async (req, res) => {
  try {
    const { id } = req.params;
    let deleted = false;

    if (isMongoConnected) {
      if (id.startsWith('SOLAR-REQ-')) {
        const res = await Consultation.findOneAndDelete({ ticketNumber: id });
        deleted = !!res;
      } else {
        const res = await Consultation.findByIdAndDelete(id).catch(() => null);
        deleted = !!res;
      }
    } else {
      deleted = localStore.deleteConsultation(id);
    }

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: `Consultation with ID "${id}" was not found.`
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Consultation deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting consultation:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Server error deleting consultation.',
      error: error.message
    });
  }
};

