import { useState } from 'react';
import MultiSelect from '../MultiSelect/MultiSelect';
import DateTimePicker from '../DateTimePicker/DateTimePicker';
import './EventForm.css';

const TIMEZONES = [
  { value: 'America/New_York', label: 'Eastern Time (ET)' },
  { value: 'America/Chicago', label: 'Central Time (CT)' },
  { value: 'America/Denver', label: 'Mountain Time (MT)' },
  { value: 'America/Los_Angeles', label: 'Pacific Time (PT)' },
  { value: 'Asia/Kolkata', label: 'India (IST)' },
  { value: 'Europe/London', label: 'London (GMT)' },
  { value: 'Asia/Tokyo', label: 'Tokyo (JST)' },
];

const EventForm = ({ profiles, onEventCreated, onAddProfile }) => {
  const [selectedProfiles, setSelectedProfiles] = useState([]);
  const [timezone, setTimezone] = useState('America/New_York');
  const [startDate, setStartDate] = useState('');
  const [startTime, setStartTime] = useState('09:00');
  const [endDate, setEndDate] = useState('');
  const [endTime, setEndTime] = useState('09:00');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (selectedProfiles.length === 0 || !startDate || !endDate) {
      alert('Please fill in all required fields');
      return;
    }

    const newEvent = {
      profiles: selectedProfiles,
      timezone,
      startDateTime: `${startDate}T${startTime}`,
      endDateTime: `${endDate}T${endTime}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    onEventCreated(newEvent);
    
    // Reset form
    setSelectedProfiles([]);
    setStartDate('');
    setEndDate('');
    setStartTime('09:00');
    setEndTime('09:00');
  };

  return (
    <div className="event-form-card">
      <h2 className="event-form-title">Create Event</h2>
      <form onSubmit={handleSubmit} className="event-form">
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
          <select
            className="form-select"
            value={timezone}
            onChange={(e) => setTimezone(e.target.value)}
          >
            {TIMEZONES.map(tz => (
              <option key={tz.value} value={tz.value}>
                {tz.label}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">Start Date & Time</label>
          <DateTimePicker
            date={startDate}
            time={startTime}
            onDateChange={setStartDate}
            onTimeChange={setStartTime}
          />
        </div>

        <div className="form-group">
          <label className="form-label">End Date & Time</label>
          <DateTimePicker
            date={endDate}
            time={endTime}
            onDateChange={setEndDate}
            onTimeChange={setEndTime}
            minDate={startDate}
          />
        </div>

        <button type="submit" className="btn-primary">
          <span className="btn-icon">+</span>
          Create Event
        </button>
      </form>
    </div>
  );
};

export default EventForm;
