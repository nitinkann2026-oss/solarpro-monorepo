import mongoose from 'mongoose';

/**
 * --------------------------------------------------------------------------
 * SOLAR PROJECT SCHEMA & MODEL
 * --------------------------------------------------------------------------
 * Represents completed or showcased solar engineering installations in the
 * project portfolio gallery.
 */

const projectSchema = new mongoose.Schema(
  {
    projectId: {
      type: String,
      required: true,
      unique: true
    },
    title: {
      type: String,
      required: true,
      trim: true
    },
    category: {
      type: String,
      required: true,
      enum: ['Residential', 'Commercial', 'Industrial']
    },
    capacity: {
      type: String,
      required: true
    },
    location: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    stats: {
      modules: { type: String, default: '' },
      inverter: { type: String, default: '' },
      estimatedDailyYield: { type: String, default: '' }
    },
    isDemo: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

const Project = mongoose.model('Project', projectSchema);

export default Project;
