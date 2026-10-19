import mongoose from 'mongoose';

/**
 * --------------------------------------------------------------------------
 * SOLAR SOLUTION SCHEMA & MODEL
 * --------------------------------------------------------------------------
 * Represents solar service packages and engineering offerings.
 */

const solutionSchema = new mongoose.Schema(
  {
    solutionId: {
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
      required: true
    },
    iconName: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    highlights: {
      type: [String],
      default: []
    },
    ctaText: {
      type: String,
      default: 'Get a Quote'
    },
    ctaHref: {
      type: String,
      default: '#contact'
    }
  },
  {
    timestamps: true
  }
);

const Solution = mongoose.model('Solution', solutionSchema);

export default Solution;
