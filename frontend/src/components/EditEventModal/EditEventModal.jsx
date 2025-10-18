import { useState } from 'react';
import MultiSelect from '../MultiSelect/MultiSelect';
import DateTimePicker from '../DateTimePicker/DateTimePicker';
import './EditEventModal.css';

const TIMEZONES = [
  { value: 'America/New_York', label: 'Eastern Time (ET)' },
  { value: 'America/Chicago', label: 'Central Time (CT)' },
  { value: 'America/Denver', label: 'Mountain Time (MT)' },
  { value: 'America/Los_Angeles', label: 'Pacific Time (PT)' },
  { value: 'Asia/Kolkata', label: 'India (IST)' },
  { value: 'Europe/London', label: 'London (GMT)' },
  { value: 'Asia/Tokyo', label: 'Tokyo (JST)' },
];

const EditEventModal = ({ event, profiles, onClose, onSave }) => {
  const [selectedProfiles, setSelectedProfiles] = useState(event.profiles);
  const [timezone, setTimezone] = useState(event.timezone);
  const [startDate, setStartDate] = useState(event.startDateTime.split('T')[0]);
  const [startTime, setStartTime] = useState(event.startDateTime.split('T')[1] || '09:00');
  const [endDate, setEndDate] = useState(event.endDateTime.split('T')[0]);
  const [endTime, setEndTime] = useState(event.endDateTime.split('T')[1] || '09:00');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (selectedProfiles.length === 0 || !startDate || !endDate) {
      alert('Please fill in all required fields');
      return;
    }

    const updatedEvent = {
      ...event,
      profiles: selectedProfiles,
      timezone,
      startDateTime: `${startDate}T${startTime}`,
      endDateTime: `${endDate}T${endTime}`,
      updatedAt: new Date().toISOString(),
    };

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
              onAddNew={() => {}}
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
