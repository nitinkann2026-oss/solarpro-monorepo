import mongoose from 'mongoose';

/**
 * --------------------------------------------------------------------------
 * CONSULTATION / QUOTE SCHEMA & MODEL
 * --------------------------------------------------------------------------
 * What is a Schema in Mongoose?
 * - Think of a Schema as a blueprint or contract. It defines:
 *   1. What fields are allowed (e.g. fullName, phone, email).
 *   2. What data types they are (String, Number, Date, Boolean).
 *   3. Validation rules (e.g. required: true, lowercase: true).
 *   4. Default values (e.g. status: 'pending').
 *
 * What is a Model?
 * - A Model is a wrapper around the Schema. It gives you functions to:
 *   - Create records: Consultation.create({ ... })
 *   - Read records: Consultation.find()
 *   - Update records: Consultation.findByIdAndUpdate(...)
 *   - Delete records: Consultation.findByIdAndDelete(...)
 */

const consultationSchema = new mongoose.Schema(
  {
    // The user's full name from the contact form
    fullName: {
      type: String,
      required: [true, 'Please provide your full name'],
      trim: true
    },

    // The user's contact phone number
    phone: {
      type: String,
      required: [true, 'Please provide a valid phone number'],
      trim: true
    },

    // The user's email address
    email: {
      type: String,
      required: [true, 'Please provide your email address'],
      trim: true,
      lowercase: true
    },

    // Selected property category (Residential, Commercial, Industrial, etc.)
    propertyType: {
      type: String,
      required: true,
      default: 'Residential Rooftop'
    },

    // Range of their current utility electric bill
    monthlyBill: {
      type: String,
      required: true,
      default: '$200 - $500'
    },

    // Additional roof or electrical remarks
    notes: {
      type: String,
      default: '',
      trim: true
    },

    // Generated human-friendly tracking reference e.g., SOLAR-REQ-849201
    ticketNumber: {
      type: String,
      required: true,
      unique: true
    },

    // Workflow status for engineering / sales follow-up
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected', 'contacted', 'scheduled', 'completed', 'cancelled'],
      default: 'pending'
    },

    // Optional snapshot if submitted directly after using the Solar Calculator
    calculatorEstimate: {
      systemSizeKw: Number,
      panelCount: Number,
      monthlySavings: Number,
      annualSavings: Number
    }
  },
  {
    // Automatically manage createdAt and updatedAt timestamps
    timestamps: true
  }
);

const Consultation = mongoose.model('Consultation', consultationSchema);

export default Consultation;
