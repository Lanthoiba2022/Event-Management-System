import { useState, useEffect } from 'react';
import { X, Clock } from 'lucide-react';
import { logsAPI } from '../../services/api';
import './EventLogsModal.css';

const EventLogsModal = ({ event, profiles, onClose }) => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchLogs();
  }, [event._id]);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await logsAPI.getByEventId(event._id);
      setLogs(response.data);
    } catch (err) {
      console.error('Error fetching logs:', err);
      setError('Failed to load event logs');
    } finally {
      setLoading(false);
    }
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) +
      ' at ' + date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
  };

  const formatProfileNames = (profileIds) => {
    if (!profileIds || !Array.isArray(profileIds)) return 'None';
    return profileIds.map(id => {
      const profile = profiles.find(p => p._id === id);
      return profile ? profile.name : `Unknown (${id})`;
    }).join(', ');
  };

  const formatFieldValue = (field, value) => {
    if (field === 'profiles') {
      return formatProfileNames(value);
    }
    if (field === 'startDateTime' || field === 'endDateTime') {
      try {
        const date = new Date(value);
        return date.toLocaleString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          hour12: true
        });
      } catch (error) {
        return value;
      }
    }
    return value;
  };

  const getChangeDescription = (change) => {
    const field = change.field;
    const oldValue = formatFieldValue(field, change.oldValue);
    const newValue = formatFieldValue(field, change.newValue);

    switch (field) {
      case 'profiles':
        return `Profiles changed to: ${newValue}`;
      case 'timezone':
        return `Timezone changed from "${oldValue}" to "${newValue}"`;
      case 'startDateTime':
        return `Start date/time updated`;
      case 'endDateTime':
        return `End date/time updated`;
      default:
        return `${field} changed from "${oldValue}" to "${newValue}"`;
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content logs-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Event Update History</h2>
          <button className="modal-close" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="logs-container">
          {loading ? (
            <div className="loading-logs">
              <p>Loading event logs...</p>
            </div>
          ) : error ? (
            <div className="error-logs">
              <p>{error}</p>
              <button onClick={fetchLogs} className="btn-secondary">
                Retry
              </button>
            </div>
          ) : logs.length === 0 ? (
            <div className="no-logs">
              <p>No update history yet</p>
            </div>
          ) : (
            <div className="logs-list">
              {logs.map((log, index) => (
                <div key={index} className="log-entry">
                  <div className="log-time">
                    <Clock size={16} />
                    <span>{formatTimestamp(log.timestamp)}</span>
                  </div>
                  <div className="log-changes">
                    {log.changes.map((change, changeIndex) => (
                      <div key={changeIndex} className="change-item">
                        <span className="change-description">
                          {getChangeDescription(change)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventLogsModal;
