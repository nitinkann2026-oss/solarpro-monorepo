import Solution from '../models/Solution.js';
import { isMongoConnected } from '../config/db.js';
import { localStore } from '../data/storage.js';

/**
 * @desc    Get all solar solution packages
 * @route   GET /api/solutions
 * @access  Public
 */
export const getSolutions = async (req, res) => {
  try {
    let solutions;

    if (isMongoConnected) {
      solutions = await Solution.find();
      if (!solutions || solutions.length === 0) {
        solutions = localStore.getSolutions();
      }
    } else {
      solutions = localStore.getSolutions();
    }

    return res.status(200).json({
      success: true,
      count: solutions.length,
      data: solutions
    });
  } catch (error) {
    console.error('Error fetching solutions:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve solutions.',
      error: error.message
    });
  }
};

/**
 * @desc    Get single solution by solutionId or MongoDB ID
 * @route   GET /api/solutions/:id
 * @access  Public
 */
export const getSolutionById = async (req, res) => {
  try {
    const { id } = req.params;
    let solution = null;

    if (isMongoConnected) {
      solution = await Solution.findOne({ solutionId: id });
      if (!solution) {
        solution = await Solution.findById(id).catch(() => null);
      }
    }

    if (!solution) {
      const list = localStore.getSolutions();
      solution = list.find((s) => s.solutionId === id || s.id === id);
    }

    if (!solution) {
      return res.status(404).json({
        success: false,
        message: `Solution with ID "${id}" was not found.`
      });
    }

    return res.status(200).json({
      success: true,
      data: solution
    });
  } catch (error) {
    console.error('Error fetching solution by ID:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Error retrieving solution details.',
      error: error.message
    });
  }
};
