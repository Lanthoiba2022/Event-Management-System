import { useState, useEffect } from 'react';
import EventForm from '../components/EventForm/EventForm';
import EventsList from '../components/EventsList/EventsList';
import ProfileSelector from '../components/ProfileSelector/ProfileSelector';
import './EventManagement.css';

const EventManagement = () => {
  const [profiles, setProfiles] = useState([]);
  const [events, setEvents] = useState([]);
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [viewTimezone, setViewTimezone] = useState('America/New_York');

  useEffect(() => {
    // TODO: Fetch profiles from API
    // fetch('/api/profiles').then(res => res.json()).then(setProfiles);
    
    // TODO: Fetch events from API
    // fetch('/api/events').then(res => res.json()).then(setEvents);
  }, []);

  const handleEventCreated = (newEvent) => {
    // TODO: POST to API
    // fetch('/api/events', { method: 'POST', body: JSON.stringify(newEvent) })
    setEvents([...events, newEvent]);
  };

  const handleEventUpdated = (updatedEvent) => {
    // TODO: PUT to API
    // fetch(`/api/events/${updatedEvent._id}`, { method: 'PUT', body: JSON.stringify(updatedEvent) })
    setEvents(events.map(e => e._id === updatedEvent._id ? updatedEvent : e));
  };

  const handleProfileAdded = (newProfile) => {
    // TODO: POST to API
    // fetch('/api/profiles', { method: 'POST', body: JSON.stringify(newProfile) })
    setProfiles([...profiles, newProfile]);
  };

  const filteredEvents = selectedProfile
    ? events.filter(e => e.profiles.includes(selectedProfile))
    : events;

  return (
    <div className="event-management">
      <div className="event-management-header">
        <div>
          <h1>Event Management</h1>
          <p className="subtitle">Create and manage events across multiple timezones</p>
        </div>
        <ProfileSelector
          profiles={profiles}
          selectedProfile={selectedProfile}
          onProfileChange={setSelectedProfile}
          onAddProfile={handleProfileAdded}
        />
      </div>

      <div className="event-management-content">
        <EventForm
          profiles={profiles}
          onEventCreated={handleEventCreated}
          onAddProfile={handleProfileAdded}
        />
        <EventsList
          events={filteredEvents}
          profiles={profiles}
          viewTimezone={viewTimezone}
          onTimezoneChange={setViewTimezone}
          onEventUpdated={handleEventUpdated}
        />
      </div>
    </div>
  );
};

export default EventManagement;
