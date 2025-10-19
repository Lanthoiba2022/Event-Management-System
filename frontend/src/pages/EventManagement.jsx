import { useState, useEffect } from 'react';
import EventForm from '../components/EventForm/EventForm';
import EventsList from '../components/EventsList/EventsList';
import ProfileSelector from '../components/ProfileSelector/ProfileSelector';
import { profilesAPI, eventsAPI } from '../services/api';
import './EventManagement.css';

const EventManagement = () => {
  const [profiles, setProfiles] = useState([]);
  const [events, setEvents] = useState([]);
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [viewTimezone, setViewTimezone] = useState('America/New_York');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch profiles and events in parallel
      const [profilesResponse, eventsResponse] = await Promise.all([
        profilesAPI.getAll(),
        eventsAPI.getAll()
      ]);
      
      setProfiles(profilesResponse.data);
      setEvents(eventsResponse.data);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Failed to load data. Please check if the backend server is running.');
    } finally {
      setLoading(false);
    }
  };

  const handleEventCreated = async (newEvent) => {
    try {
      const response = await eventsAPI.create(newEvent);
      setEvents([...events, response.data]);
    } catch (err) {
      console.error('Error creating event:', err);
      alert('Failed to create event: ' + err.message);
    }
  };

  const handleEventUpdated = async (updatedEvent) => {
    try {
      const response = await eventsAPI.update(updatedEvent._id, updatedEvent);
      setEvents(events.map(e => e._id === updatedEvent._id ? response.data : e));
    } catch (err) {
      console.error('Error updating event:', err);
      alert('Failed to update event: ' + err.message);
    }
  };

  const handleProfileAdded = async (newProfile) => {
    try {
      const response = await profilesAPI.create(newProfile);
      setProfiles([...profiles, response.data]);
      return response.data; // Return the created profile
    } catch (err) {
      console.error('Error creating profile:', err);
      alert('Failed to create profile: ' + err.message);
      throw err; // Re-throw the error so MultiSelect can handle it
    }
  };

  const handleProfileDeleted = async (profileId) => {
    try {
      await profilesAPI.delete(profileId);
      setProfiles(profiles.filter(p => p._id !== profileId));
      // If the deleted profile was selected, clear the selection
      if (selectedProfile === profileId) {
        setSelectedProfile(null);
      }
    } catch (err) {
      console.error('Error deleting profile:', err);
      alert('Failed to delete profile: ' + err.message);
    }
  };

  const handleEventDeleted = async (eventId) => {
    try {
      await eventsAPI.delete(eventId);
      setEvents(events.filter(e => e._id !== eventId));
    } catch (err) {
      console.error('Error deleting event:', err);
      alert('Failed to delete event: ' + err.message);
      throw err; // Re-throw so the dialog can handle it
    }
  };

  const filteredEvents = selectedProfile
    ? events.filter(e => e.profiles.some(p => p._id === selectedProfile))
    : events;

  if (loading) {
    return (
      <div className="event-management">
        <div className="loading-container">
          <h2>Loading...</h2>
          <p>Please wait while we fetch your data.</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="event-management">
        <div className="error-container">
          <h2>Error</h2>
          <p>{error}</p>
          <button onClick={fetchData} className="btn-primary">
            Retry
          </button>
        </div>
      </div>
    );
  }

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
          onDeleteProfile={handleProfileDeleted}
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
          onProfileAdded={handleProfileAdded}
          onEventDeleted={handleEventDeleted}
        />
      </div>
    </div>
  );
};

export default EventManagement;
