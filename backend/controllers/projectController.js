import Project from '../models/Project.js';
import { isMongoConnected } from '../config/db.js';
import { localStore } from '../data/storage.js';

/**
 * @desc    Get all solar portfolio projects
 * @route   GET /api/projects
 * @access  Public
 */
export const getProjects = async (req, res) => {
  try {
    let projects;

    if (isMongoConnected) {
      projects = await Project.find();
      // If collection is empty, fall back to initial data
      if (!projects || projects.length === 0) {
        projects = localStore.getProjects();
      }
    } else {
      projects = localStore.getProjects();
    }

    return res.status(200).json({
      success: true,
      count: projects.length,
      data: projects
    });
  } catch (error) {
    console.error('Error fetching projects:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve project portfolio.',
      error: error.message
    });
  }
};

/**
 * @desc    Get single project by projectId or MongoDB ID
 * @route   GET /api/projects/:id
 * @access  Public
 */
export const getProjectById = async (req, res) => {
  try {
    const { id } = req.params;
    let project = null;

    if (isMongoConnected) {
      project = await Project.findOne({ projectId: id });
      if (!project) {
        project = await Project.findById(id).catch(() => null);
      }
    }

    if (!project) {
      const list = localStore.getProjects();
      project = list.find((p) => p.projectId === id || p.id === id);
    }

    if (!project) {
      return res.status(404).json({
        success: false,
        message: `Project with ID "${id}" was not found.`
      });
    }

    return res.status(200).json({
      success: true,
      data: project
    });
  } catch (error) {
    console.error('Error fetching project by ID:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Error retrieving project details.',
      error: error.message
    });
  }
};
