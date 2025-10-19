import { useState } from 'react';
import MultiSelect from '../MultiSelect/MultiSelect';
import DateTimePicker from '../DateTimePicker/DateTimePicker';
import TimezoneSelector from '../TimezoneSelector/TimezoneSelector';
import './EditEventModal.css';

const EditEventModal = ({ event, profiles, onClose, onSave, onAddProfile }) => {
  // Parse ISO datetime and convert to event timezone for editing
  const parseISOToLocalTime = (isoString, timezone) => {
    try {
      const date = new Date(isoString);
      
      // Use Intl.DateTimeFormat for more reliable timezone conversion
      const dateFormatter = new Intl.DateTimeFormat('en-CA', { 
        timeZone: timezone,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      });
      
      const timeFormatter = new Intl.DateTimeFormat('en-US', { 
        timeZone: timezone,
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      });
      
      const dateParts = dateFormatter.formatToParts(date);
      const timeParts = timeFormatter.formatToParts(date);
      
      const year = dateParts.find(part => part.type === 'year').value;
      const month = dateParts.find(part => part.type === 'month').value;
      const day = dateParts.find(part => part.type === 'day').value;
      const hour = timeParts.find(part => part.type === 'hour').value;
      const minute = timeParts.find(part => part.type === 'minute').value;
      
      return {
        date: `${year}-${month}-${day}`,
        time: `${hour}:${minute}`
      };
    } catch (error) {
      console.error('Error parsing datetime:', error);
      // Fallback to current date/time
      const now = new Date();
      return {
        date: now.toISOString().split('T')[0],
        time: '09:00'
      };
    }
  };

  const startParsed = parseISOToLocalTime(event.startDateTime, event.timezone);
  const endParsed = parseISOToLocalTime(event.endDateTime, event.timezone);

  // Handle profiles - they might be populated objects or IDs
  const getProfileIds = (profiles) => {
    if (!profiles || profiles.length === 0) return [];
    // Check if profiles are objects with _id property (populated)
    if (typeof profiles[0] === 'object' && profiles[0]._id) {
      return profiles.map(p => p._id);
    }
    // Otherwise they are already IDs
    return profiles;
  };

  const [selectedProfiles, setSelectedProfiles] = useState(getProfileIds(event.profiles));
  const [timezone, setTimezone] = useState(event.timezone);
  const [startDate, setStartDate] = useState(startParsed.date);
  const [startTime, setStartTime] = useState(startParsed.time);
  const [endDate, setEndDate] = useState(endParsed.date);
  const [endTime, setEndTime] = useState(endParsed.time);
  
  // Track if datetime fields have been modified
  const [startDateTimeModified, setStartDateTimeModified] = useState(false);
  const [endDateTimeModified, setEndDateTimeModified] = useState(false);

  // Handle start date change - if end date is before new start date, update end date
  const handleStartDateChange = (newStartDate) => {
    setStartDate(newStartDate);
    setStartDateTimeModified(true);
    if (endDate && newStartDate && endDate < newStartDate) {
      setEndDate(newStartDate);
      setEndDateTimeModified(true);
    }
  };

  const handleStartTimeChange = (newStartTime) => {
    setStartTime(newStartTime);
    setStartDateTimeModified(true);
  };

  const handleEndDateChange = (newEndDate) => {
    setEndDate(newEndDate);
    setEndDateTimeModified(true);
  };

  const handleEndTimeChange = (newEndTime) => {
    setEndTime(newEndTime);
    setEndDateTimeModified(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (selectedProfiles.length === 0 || !startDate || !endDate) {
      alert('Please fill in all required fields');
      return;
    }

    // Create the updated event data in the format expected by the backend
    const updatedEvent = {
      _id: event._id,
      profiles: selectedProfiles,
      timezone,
      createdAt: event.createdAt,
      updatedAt: new Date().toISOString(),
    };

    // Only include datetime values if they were modified
    if (startDateTimeModified) {
      updatedEvent.startDateTime = `${startDate}T${startTime}`;
    }
    
    if (endDateTimeModified) {
      updatedEvent.endDateTime = `${endDate}T${endTime}`;
    }


    onSave(updatedEvent);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Edit Event</h2>
          <button className="modal-close" onClick={onClose}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path
                d="M15 5L5 15M5 5L15 15"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label className="form-label">Profiles</label>
            <MultiSelect
              options={profiles}
              selected={selectedProfiles}
              onChange={setSelectedProfiles}
              onAddNew={onAddProfile}
              placeholder="Select profiles..."
            />
          </div>

          <div className="form-group">
            <label className="form-label">Timezone</label>
            <TimezoneSelector
              selectedTimezone={timezone}
              onTimezoneChange={setTimezone}
              placeholder="Select timezone..."
            />
          </div>

          <div className="form-group">
            <label className="form-label">Start Date & Time</label>
            <DateTimePicker
              date={startDate}
              time={startTime}
              onDateChange={handleStartDateChange}
              onTimeChange={handleStartTimeChange}
            />
          </div>

          <div className="form-group">
            <label className="form-label">End Date & Time</label>
            <DateTimePicker
              date={endDate}
              time={endTime}
              onDateChange={handleEndDateChange}
              onTimeChange={handleEndTimeChange}
              minDate={startDate}
            />
          </div>

          <div className="modal-actions">
            <button type="button" className="btn-cancel" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              Update Event
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditEventModal;
