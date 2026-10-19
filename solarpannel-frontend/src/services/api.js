/**
 * --------------------------------------------------------------------------
 * FRONTEND API SERVICE (CLIENT-SERVER COMMUNICATION)
 * --------------------------------------------------------------------------
 * This module connects your React frontend with the Node.js / Express backend.
 * Whenever the user interacts with the app (e.g. submitting a contact form),
 * these helper functions send HTTP requests to the backend server.
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

/**
 * Check if the backend server is running and healthy
 */
export async function checkBackendHealth() {
  try {
    const res = await fetch(`${API_BASE_URL}/health`);
    if (!res.ok) throw new Error('Health check failed');
    return await res.json();
  } catch (err) {
    return { status: 'offline', error: err.message };
  }
}

/**
 * Submit a solar consultation quote request to the backend
 * @param {Object} formData
 * @returns {Promise<Object>}
 */
export async function submitConsultationQuote(formData) {
  try {
    const response = await fetch(`${API_BASE_URL}/consultations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to submit quote request');
    }

    return { success: true, ...data };
  } catch (error) {
    console.error('Backend API submission error:', error.message);
    return {
      success: false,
      message: 'Backend server is offline! Please start backend on port 5000 (cd backend && npm run dev).'
    };
  }
}

/**
 * Fetch solar projects from the backend
 */
export async function fetchProjects() {
  try {
    const res = await fetch(`${API_BASE_URL}/projects`);
    if (!res.ok) throw new Error('Failed to fetch projects');
    return await res.json();
  } catch (err) {
    return null;
  }
}

/**
 * Fetch solar solutions from the backend
 */
export async function fetchSolutions() {
  try {
    const res = await fetch(`${API_BASE_URL}/solutions`);
    if (!res.ok) throw new Error('Failed to fetch solutions');
    return await res.json();
  } catch (err) {
    return null;
  }
}

/**
 * Calculate solar savings via backend
 */
export async function calculateSolarSavings(payload) {
  try {
    const res = await fetch(`${API_BASE_URL}/calculator/calculate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!res.ok) throw new Error('Calculation request failed');
    return await res.json();
  } catch (err) {
    return null;
  }
}

/**
 * Fetch all consultation quote submissions for the Admin Panel
 */
export async function fetchConsultations() {
  try {
    const res = await fetch(`${API_BASE_URL}/consultations`);
    if (!res.ok) throw new Error('Failed to fetch consultations');
    return await res.json();
  } catch (err) {
    console.error('Error in fetchConsultations:', err.message);
    return { success: false, data: [] };
  }
}

/**
 * Update the status of a consultation request (Admin)
 */
export async function updateConsultationStatus(id, status) {
  try {
    const res = await fetch(`${API_BASE_URL}/consultations/${id}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
    return await res.json();
  } catch (err) {
    return { success: false, message: err.message };
  }
}

/**
 * Update full consultation details (Admin Edit)
 */
export async function updateConsultation(id, updatedFields) {
  try {
    const res = await fetch(`${API_BASE_URL}/consultations/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedFields)
    });
    return await res.json();
  } catch (err) {
    return { success: false, message: err.message };
  }
}

/**
 * Delete a consultation request (Admin)
 */
export async function deleteConsultation(id) {
  try {
    const res = await fetch(`${API_BASE_URL}/consultations/${id}`, {
      method: 'DELETE'
    });
    return await res.json();
  } catch (err) {
    return { success: false, message: err.message };
  }
}

/**
 * Login user / admin
 */
export async function loginUser(credentials) {
  try {
    const res = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials)
    });
    return await res.json();
  } catch (err) {
    // Local fallback for offline mode
    if (credentials.email && credentials.password) {
      return {
        success: true,
        message: 'Logged in locally',
        user: {
          name: credentials.role === 'customer' ? 'Customer Client' : 'SolarPro Admin',
          email: credentials.email,
          role: credentials.role || 'admin'
        }
      };
    }
    return { success: false, message: 'Server connection failed' };
  }
}


