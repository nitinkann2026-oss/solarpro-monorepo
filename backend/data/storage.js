import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { initialProjects } from './initialProjects.js';
import { initialSolutions } from './initialSolutions.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CONSULTATIONS_FILE = path.join(__dirname, 'consultations.json');

/**
 * Ensures the consultations.json file exists.
 * If not, it creates it with an empty array.
 */
function ensureStorageFile() {
  try {
    if (!fs.existsSync(CONSULTATIONS_FILE)) {
      fs.writeFileSync(CONSULTATIONS_FILE, JSON.stringify([], null, 2), 'utf-8');
    }
  } catch (err) {
    console.error('Error initializing storage file:', err.message);
  }
}

// Initialize on load
ensureStorageFile();

export const localStore = {
  // Read all consultation quotes
  getConsultations: () => {
    ensureStorageFile();
    try {
      const data = fs.readFileSync(CONSULTATIONS_FILE, 'utf-8');
      return JSON.parse(data || '[]');
    } catch {
      return [];
    }
  },

  // Save a new consultation quote
  saveConsultation: (consultation) => {
    const all = localStore.getConsultations();
    all.unshift(consultation); // Add to the top of the list
    fs.writeFileSync(CONSULTATIONS_FILE, JSON.stringify(all, null, 2), 'utf-8');
    return consultation;
  },

  // Find a consultation by ticket reference or id
  findConsultation: (idOrTicket) => {
    const all = localStore.getConsultations();
    return all.find(
      (c) => c._id === idOrTicket || c.ticketNumber === idOrTicket
    ) || null;
  },

  // Update status of a consultation
  updateStatus: (idOrTicket, newStatus) => {
    const all = localStore.getConsultations();
    const item = all.find((c) => c._id === idOrTicket || c.ticketNumber === idOrTicket);
    if (item) {
      item.status = newStatus;
      item.updatedAt = new Date().toISOString();
      fs.writeFileSync(CONSULTATIONS_FILE, JSON.stringify(all, null, 2), 'utf-8');
      return item;
    }
    return null;
  },

  // Update any fields of a consultation
  updateConsultation: (idOrTicket, fields) => {
    const all = localStore.getConsultations();
    const item = all.find((c) => c._id === idOrTicket || c.ticketNumber === idOrTicket);
    if (item) {
      Object.assign(item, fields);
      item.updatedAt = new Date().toISOString();
      fs.writeFileSync(CONSULTATIONS_FILE, JSON.stringify(all, null, 2), 'utf-8');
      return item;
    }
    return null;
  },

  // Delete a consultation
  deleteConsultation: (idOrTicket) => {
    const all = localStore.getConsultations();
    const filtered = all.filter((c) => c._id !== idOrTicket && c.ticketNumber !== idOrTicket);
    if (filtered.length !== all.length) {
      fs.writeFileSync(CONSULTATIONS_FILE, JSON.stringify(filtered, null, 2), 'utf-8');
      return true;
    }
    return false;
  },

  // Solar Projects
  getProjects: () => initialProjects,

  // Solar Solutions
  getSolutions: () => initialSolutions
};
