import './EventCard.css';
import { Users, Calendar, Clock, Edit, FileText } from 'lucide-react';

const EventCard = ({ event, profiles, viewTimezone, onEdit, onViewLogs }) => {
  const getProfileNames = () => {
    return event.profiles
      .map(profileId => profiles.find(p => p._id === profileId)?.name)
      .filter(Boolean)
      .join(', ');
  };

  const formatDateTime = (dateTimeStr) => {
    const date = new Date(dateTimeStr);
    const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    const timeStr = date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
    return { dateStr, timeStr };
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) +
      ' at ' + date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
  };

  const start = formatDateTime(event.startDateTime);
  const end = formatDateTime(event.endDateTime);

  return (
    <div className="event-card">
      <div className="event-card-header">
        <div className="event-profiles">
          <Users size={16} />
          <span>{getProfileNames()}</span>
        </div>
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
