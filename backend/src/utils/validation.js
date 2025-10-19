// Validation helper functions

export const validateProfile = (profileData) => {
  const errors = [];

  if (!profileData.name || profileData.name.trim() === '') {
    errors.push('Profile name is required');
  }

  if (profileData.name && profileData.name.length > 100) {
    errors.push('Profile name cannot exceed 100 characters');
  }

  return errors;
};

export const validateEvent = (eventData) => {
  const errors = [];

  if (!eventData.profiles || !Array.isArray(eventData.profiles) || eventData.profiles.length === 0) {
    errors.push('At least one profile is required');
  }

  if (!eventData.timezone || eventData.timezone.trim() === '') {
    errors.push('Timezone is required');
  }

  if (!eventData.startDateTime || eventData.startDateTime.trim() === '') {
    errors.push('Start date and time is required');
  }

  if (!eventData.endDateTime || eventData.endDateTime.trim() === '') {
    errors.push('End date and time is required');
  }

  // Validate datetime logic
  if (eventData.startDateTime && eventData.endDateTime) {
    const startDate = new Date(eventData.startDateTime);
    const endDate = new Date(eventData.endDateTime);

    if (isNaN(startDate.getTime())) {
      errors.push('Invalid start date and time format');
    }

    if (isNaN(endDate.getTime())) {
      errors.push('Invalid end date and time format');
    }

    if (!isNaN(startDate.getTime()) && !isNaN(endDate.getTime()) && endDate <= startDate) {
      errors.push('End date and time must be after start date and time');
    }
  }

  return errors;
};

export const validateObjectId = (id) => {
  const objectIdRegex = /^[0-9a-fA-F]{24}$/;
  return objectIdRegex.test(id);
};
