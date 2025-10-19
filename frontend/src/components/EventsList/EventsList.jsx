import { useState } from 'react';
import EventCard from '../EventCard/EventCard';
import EditEventModal from '../EditEventModal/EditEventModal';
import EventLogsModal from '../EventLogsModal/EventLogsModal';
import TimezoneSelector from '../TimezoneSelector/TimezoneSelector';
import './EventsList.css';

const EventsList = ({ events, profiles, viewTimezone, onTimezoneChange, onEventUpdated, onProfileAdded, onEventDeleted }) => {
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
        <TimezoneSelector
          selectedTimezone={viewTimezone}
          onTimezoneChange={onTimezoneChange}
          placeholder="Select timezone..."
        />
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
              onDelete={onEventDeleted}
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
          onAddProfile={onProfileAdded}
        />
      )}

      {viewingLogs && (
        <EventLogsModal
          event={viewingLogs}
          profiles={profiles}
          onClose={() => setViewingLogs(null)}
        />
      )}
    </div>
  );
};

export default EventsList;
