import Event from '../models/Event.js';
import EventLog from '../models/EventLog.js';
import Profile from '../models/Profile.js';

// Get all events (with optional profile filter)
export const getEvents = async (req, res) => {
  try {
    const { profileId } = req.query;
    let query = {};

    if (profileId) {
      query.profiles = profileId;
    }

    const events = await Event.find(query)
      .populate('profiles', 'name')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: events
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching events',
      error: error.message
    });
  }
};

// Create a new event
export const createEvent = async (req, res) => {
  try {
    const { profiles, timezone, startDateTime, endDateTime } = req.body;

    // Validation
    if (!profiles || !Array.isArray(profiles) || profiles.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'At least one profile is required'
      });
    }

    if (!timezone || !startDateTime || !endDateTime) {
      return res.status(400).json({
        success: false,
        message: 'Timezone, start date/time, and end date/time are required'
      });
    }

    // Validate that profiles exist
    const existingProfiles = await Profile.find({ _id: { $in: profiles } });
    if (existingProfiles.length !== profiles.length) {
      return res.status(400).json({
        success: false,
        message: 'One or more profiles do not exist'
      });
    }

    // Validate datetime logic and convert to ISO format with timezone
    // Parse the datetime in the context of the provided timezone
    // The input is "YYYY-MM-DDTHH:mm" format (e.g., "2024-01-15T09:00")
    // We need to create a proper ISO string that represents this time in the given timezone
    
    const startDate = new Date(startDateTime);
    const endDate = new Date(endDateTime);

    if (endDate <= startDate) {
      return res.status(400).json({
        success: false,
        message: 'End date and time must be after start date and time'
      });
    }

    // Store the datetime as ISO string for proper timezone handling
    // This way the frontend can properly convert between timezones
    const startISO = startDate.toISOString();
    const endISO = endDate.toISOString();

    const event = new Event({
      profiles,
      timezone,
      startDateTime: startISO,
      endDateTime: endISO
    });

    const savedEvent = await event.save();
    await savedEvent.populate('profiles', 'name');

    res.status(201).json({
      success: true,
      data: savedEvent
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating event',
      error: error.message
    });
  }
};

// Get a single event
export const getEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const event = await Event.findById(id).populate('profiles', 'name');

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    res.status(200).json({
      success: true,
      data: event
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching event',
      error: error.message
    });
  }
};

// Update an event
export const updateEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const { profiles, timezone, startDateTime, endDateTime } = req.body;

    // Get the original event for comparison
    const originalEvent = await Event.findById(id);
    if (!originalEvent) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    // Validation
    if (!profiles || !Array.isArray(profiles) || profiles.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'At least one profile is required'
      });
    }

    if (!timezone) {
      return res.status(400).json({
        success: false,
        message: 'Timezone is required'
      });
    }

    // Validate that profiles exist
    const existingProfiles = await Profile.find({ _id: { $in: profiles } });
    if (existingProfiles.length !== profiles.length) {
      return res.status(400).json({
        success: false,
        message: 'One or more profiles do not exist'
      });
    }

    // Check if datetime values have actually changed
    const originalStartDateTime = originalEvent.startDateTime;
    const originalEndDateTime = originalEvent.endDateTime;
    
    // Only validate datetime if they are provided
    if (startDateTime && endDateTime) {
      // Parse the incoming datetime strings
      const startDate = new Date(startDateTime);
      const endDate = new Date(endDateTime);

      if (endDate <= startDate) {
        return res.status(400).json({
          success: false,
          message: 'End date and time must be after start date and time'
        });
      }
    }

    // Convert both original and incoming datetimes to the same format for comparison
    // We need to compare them in the same timezone context
    // Use getTime() to compare the actual timestamp values
    const originalStartTime = new Date(originalStartDateTime).getTime();
    const originalEndTime = new Date(originalEndDateTime).getTime();
    
    // Only compare datetime if they are provided in the request
    let incomingStartTime = null;
    let incomingEndTime = null;
    
    if (startDateTime) {
      const startDate = new Date(startDateTime);
      incomingStartTime = startDate.getTime();
    }
    
    if (endDateTime) {
      const endDate = new Date(endDateTime);
      incomingEndTime = endDate.getTime();
    }
    

    // Only convert to ISO if the datetime values have actually changed
    let startISO = originalStartDateTime;
    let endISO = originalEndDateTime;
    
    if (startDateTime && incomingStartTime !== originalStartTime) {
      const startDate = new Date(startDateTime);
      startISO = startDate.toISOString();
    }
    
    if (endDateTime && incomingEndTime !== originalEndTime) {
      const endDate = new Date(endDateTime);
      endISO = endDate.toISOString();
    }

    // Prepare update object with only changed fields
    const updateData = { profiles, timezone };
    
    if (startDateTime && incomingStartTime !== originalStartTime) {
      updateData.startDateTime = startISO;
    }
    
    if (endDateTime && incomingEndTime !== originalEndTime) {
      updateData.endDateTime = endISO;
    }

    // Update the event
    const updatedEvent = await Event.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).populate('profiles', 'name');

    // Create event log for changes
    const changes = [];
    
    // Compare profiles - handle both populated and non-populated cases
    const originalProfileIds = originalEvent.profiles.map(p => 
      typeof p === 'object' ? p._id.toString() : p.toString()
    );
    const newProfileIds = profiles.map(p => p.toString());
    
    if (JSON.stringify(originalProfileIds.sort()) !== JSON.stringify(newProfileIds.sort())) {
      changes.push({
        field: 'profiles',
        oldValue: originalProfileIds,
        newValue: newProfileIds
      });
    }
    
    if (originalEvent.timezone !== timezone) {
      changes.push({
        field: 'timezone',
        oldValue: originalEvent.timezone,
        newValue: timezone
      });
    }
    
    if (startDateTime && incomingStartTime !== originalStartTime) {
      changes.push({
        field: 'startDateTime',
        oldValue: originalStartDateTime,
        newValue: startISO
      });
    }
    
    if (endDateTime && incomingEndTime !== originalEndTime) {
      changes.push({
        field: 'endDateTime',
        oldValue: originalEndDateTime,
        newValue: endISO
      });
    }

    // Save event log if there are changes
    if (changes.length > 0) {
      const eventLog = new EventLog({
        eventId: id,
        changes
      });
      await eventLog.save();
    }

    res.status(200).json({
      success: true,
      data: updatedEvent
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating event',
      error: error.message
    });
  }
};

// Delete an event
export const deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const event = await Event.findByIdAndDelete(id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    // Also delete associated event logs
    await EventLog.deleteMany({ eventId: id });

    res.status(200).json({
      success: true,
      message: 'Event deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting event',
      error: error.message
    });
  }
};
