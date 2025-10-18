import { useState, useEffect } from 'react';
import { X, Clock } from 'lucide-react';
import './EventLogsModal.css';

const EventLogsModal = ({ event, onClose }) => {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    // TODO: Fetch event logs from API
    // fetch(`/api/events/${event._id}/logs`).then(res => res.json()).then(setLogs);
    
    // Mock data for demonstration
    setLogs([]);
  }, [event._id]);

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) +
      ' at ' + date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
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
          {logs.length === 0 ? (
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
                  <div className="log-message">{log.message}</div>
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
