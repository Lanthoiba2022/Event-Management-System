import './EventCard.css';
import { Users, Calendar, Clock, Edit, FileText, Trash2 } from 'lucide-react';

const EventCard = ({ event, profiles, viewTimezone, onEdit, onViewLogs, onDelete }) => {
  const getProfileNames = () => {
    // Check if profiles are already populated (objects with name property)
    if (event.profiles && event.profiles.length > 0 && typeof event.profiles[0] === 'object' && event.profiles[0].name) {
      // Profiles are already populated, just extract the names
      return event.profiles.map(profile => profile.name).join(', ');
    }
    
    // Fallback: profiles are IDs, need to find them in the profiles prop
    return event.profiles
      .map(profileId => profiles.find(p => p._id === profileId)?.name)
      .filter(Boolean)
      .join(', ');
  };

  const formatDateTime = (dateTimeStr, originalTimezone, viewTimezone) => {
    // Parse the ISO datetime string and convert to view timezone
    // The dateTimeStr is now in ISO format (e.g., "2024-01-15T09:00:00.000Z")
    
    try {
      // Create a date object from ISO string
      const date = new Date(dateTimeStr);
      
      // Use Intl.DateTimeFormat to format in the view timezone
      // This will automatically handle the timezone conversion from UTC to the view timezone
      const dateStr = date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric',
        timeZone: viewTimezone 
      });
      const timeStr = date.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit', 
        hour12: true,
        timeZone: viewTimezone 
      });
      
      return { dateStr, timeStr };
    } catch (error) {
      console.error('Error formatting datetime:', error);
      // Fallback to original formatting
      const date = new Date(dateTimeStr);
      const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
      const timeStr = date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
      return { dateStr, timeStr };
    }
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric',
      timeZone: viewTimezone 
    }) + ' at ' + date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit', 
      hour12: true,
      timeZone: viewTimezone 
    });
  };

  const start = formatDateTime(event.startDateTime, event.timezone, viewTimezone);
  const end = formatDateTime(event.endDateTime, event.timezone, viewTimezone);

  return (
    <div className="event-card">
      <div className="event-card-header">
        <div className="event-profiles">
          <Users size={16} />
          <span>{getProfileNames()}</span>
        </div>
        <button 
          className="btn-delete" 
          onClick={() => onDelete && onDelete(event._id)}
          title="Delete event"
        >
          <Trash2 size={16} />
        </button>
      </div>

      <div className="event-card-dates">
        <div className="event-date-item">
          <Calendar size={16} />
          <div>
            <div className="date-label">Start: {start.dateStr}</div>
            <div className="time-display">
              <Clock size={14} />
              <span>{start.timeStr}</span>
            </div>
          </div>
        </div>

        <div className="event-date-item">
          <Calendar size={16} />
          <div>
            <div className="date-label">End: {end.dateStr}</div>
            <div className="time-display">
              <Clock size={14} />
              <span>{end.timeStr}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="event-card-meta">
        <div className="meta-item">Created: {formatTimestamp(event.createdAt)}</div>
        <div className="meta-item">Updated: {formatTimestamp(event.updatedAt)}</div>
        <div className="meta-item timezone-indicator">Times in {viewTimezone}</div>
      </div>

      <div className="event-card-actions">
        <button className="btn-secondary" onClick={onEdit}>
          <Edit size={16} />
          Edit
        </button>
        <button className="btn-secondary" onClick={onViewLogs}>
          <FileText size={16} />
          View Logs
        </button>
      </div>
    </div>
  );
};

export default EventCard;
