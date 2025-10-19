import EventLog from '../models/EventLog.js';
import Event from '../models/Event.js';

// Get event logs for a specific event
export const getEventLogs = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if event exists
    const event = await Event.findById(id);
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    // Get all logs for this event
    const logs = await EventLog.find({ eventId: id })
      .sort({ timestamp: -1 });

    res.status(200).json({
      success: true,
      data: logs
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching event logs',
      error: error.message
    });
  }
};

// Get all event logs (admin function)
export const getAllEventLogs = async (req, res) => {
  try {
    const logs = await EventLog.find()
      .populate('eventId', 'startDateTime endDateTime')
      .sort({ timestamp: -1 });

    res.status(200).json({
      success: true,
      data: logs
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching all event logs',
      error: error.message
    });
  }
};
