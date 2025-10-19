const API_BASE_URL = 'http://localhost:3000/api';

// Helper function to handle API responses
const handleResponse = async (response) => {
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.message || 'API request failed');
  }
  
  return data;
};

// Profiles API
export const profilesAPI = {
  // Get all profiles
  getAll: async () => {
    const response = await fetch(`${API_BASE_URL}/profiles`);
    return handleResponse(response);
  },

  // Create a new profile
  create: async (profileData) => {
    const response = await fetch(`${API_BASE_URL}/profiles`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(profileData),
    });
    return handleResponse(response);
  },

  // Update a profile
  update: async (id, profileData) => {
    const response = await fetch(`${API_BASE_URL}/profiles/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(profileData),
    });
    return handleResponse(response);
  },

  // Delete a profile
  delete: async (id) => {
    const response = await fetch(`${API_BASE_URL}/profiles/${id}`, {
      method: 'DELETE',
    });
    return handleResponse(response);
  },
};

// Events API
export const eventsAPI = {
  // Get all events (with optional profile filter)
  getAll: async (profileId = null) => {
    const url = profileId 
      ? `${API_BASE_URL}/events?profileId=${profileId}`
      : `${API_BASE_URL}/events`;
    const response = await fetch(url);
    return handleResponse(response);
  },

  // Create a new event
  create: async (eventData) => {
    const response = await fetch(`${API_BASE_URL}/events`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(eventData),
    });
    return handleResponse(response);
  },

  // Get a single event
  getById: async (id) => {
    const response = await fetch(`${API_BASE_URL}/events/${id}`);
    return handleResponse(response);
  },

  // Update an event
  update: async (id, eventData) => {
    const response = await fetch(`${API_BASE_URL}/events/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(eventData),
    });
    return handleResponse(response);
  },

  // Delete an event
  delete: async (id) => {
    const response = await fetch(`${API_BASE_URL}/events/${id}`, {
      method: 'DELETE',
    });
    return handleResponse(response);
  },
};

// Event Logs API
export const logsAPI = {
  // Get logs for a specific event
  getByEventId: async (eventId) => {
    const response = await fetch(`${API_BASE_URL}/events/${eventId}/logs`);
    return handleResponse(response);
  },

  // Get all event logs
  getAll: async () => {
    const response = await fetch(`${API_BASE_URL}/logs`);
    return handleResponse(response);
  },
};

// Health check
export const healthCheck = async () => {
  const response = await fetch(`${API_BASE_URL}/health`);
  return handleResponse(response);
};
