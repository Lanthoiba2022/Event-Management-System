import { useState } from 'react';
import EventCard from '../EventCard/EventCard';
import EditEventModal from '../EditEventModal/EditEventModal';
import EventLogsModal from '../EventLogsModal/EventLogsModal';
import './EventsList.css';

const TIMEZONES = [
  { value: 'America/New_York', label: 'Eastern Time (ET)' },
  { value: 'America/Chicago', label: 'Central Time (CT)' },
  { value: 'America/Denver', label: 'Mountain Time (MT)' },
  { value: 'America/Los_Angeles', label: 'Pacific Time (PT)' },
  { value: 'Asia/Kolkata', label: 'India (IST)' },
  { value: 'Europe/London', label: 'London (GMT)' },
  { value: 'Asia/Tokyo', label: 'Tokyo (JST)' },
];

const EventsList = ({ events, profiles, viewTimezone, onTimezoneChange, onEventUpdated }) => {
  const [editingEvent, setEditingEvent] = useState(null);
  const [viewingLogs, setViewingLogs] = useState(null);

  const handleEditClick = (event) => {
    setEditingEvent(event);
  };

  const handleViewLogsClick = (event) => {
    setViewingLogs(event);
  };

  const handleEventUpdate = (updatedEvent) => {
    onEventUpdated(updatedEvent);
    setEditingEvent(null);
  };

  return (
    <div className="events-list-card">
      <h2 className="events-list-title">Events</h2>
      
      <div className="events-list-header">
        <label className="timezone-label">View in Timezone</label>
        <select
          className="timezone-select"
          value={viewTimezone}
          onChange={(e) => onTimezoneChange(e.target.value)}
        >
          {TIMEZONES.map(tz => (
            <option key={tz.value} value={tz.value}>
              {tz.label}
            </option>
          ))}
        </select>
      </div>

      <div className="events-container">
        {events.length === 0 ? (
          <div className="no-events">
            <p>No events found</p>
          </div>
        ) : (
          events.map(event => (
            <EventCard
              key={event._id}
              event={event}
              profiles={profiles}
              viewTimezone={viewTimezone}
              onEdit={() => handleEditClick(event)}
              onViewLogs={() => handleViewLogsClick(event)}
            />
          ))
        )}
      </div>

      {editingEvent && (
        <EditEventModal
          event={editingEvent}
          profiles={profiles}
          onClose={() => setEditingEvent(null)}
          onSave={handleEventUpdate}
        />
      )}

      {viewingLogs && (
        <EventLogsModal
          event={viewingLogs}
          onClose={() => setViewingLogs(null)}
        />
      )}
    </div>
  );
};

export default EventsList;
