import { useState, useRef, useEffect } from 'react';
import './DateTimePicker.css';

const DateTimePicker = ({ date, time, onDateChange, onTimeChange, minDate }) => {
  const [showCalendar, setShowCalendar] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const calendarRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (calendarRef.current && !calendarRef.current.contains(event.target)) {
        setShowCalendar(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // Previous month days
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      days.push({
        day: prevMonthLastDay - i,
        isCurrentMonth: false,
        date: new Date(year, month - 1, prevMonthLastDay - i),
      });
    }

    // Current month days
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({
        day: i,
        isCurrentMonth: true,
        date: new Date(year, month, i),
      });
    }

    // Next month days
    const remainingDays = 42 - days.length; // 6 rows * 7 days
    for (let i = 1; i <= remainingDays; i++) {
      days.push({
        day: i,
        isCurrentMonth: false,
        date: new Date(year, month + 1, i),
      });
    }

    return days;
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'Pick a date';
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  };

  const handleDateSelect = (selectedDate) => {
    if (isDisabled(selectedDate)) return; // Prevent selection of disabled dates
    // Format date in local timezone to avoid timezone issues
    const year = selectedDate.getFullYear();
    const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
    const day = String(selectedDate.getDate()).padStart(2, '0');
    const formattedDate = `${year}-${month}-${day}`;
    onDateChange(formattedDate);
    setShowCalendar(false);
  };

  const isToday = (dateObj) => {
    const today = new Date();
    return dateObj.toDateString() === today.toDateString();
  };

  const isSelected = (dateObj) => {
    if (!date) return false;
    // Create a date object from the stored date string in local timezone
    const selectedDate = new Date(date + 'T00:00:00');
    return dateObj.toDateString() === selectedDate.toDateString();
  };

  const isDisabled = (dateObj) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time to start of day
    
    // If minDate is provided, use it; otherwise use today
    let minDateToUse;
    if (minDate) {
      minDateToUse = new Date(minDate + 'T00:00:00');
    } else {
      minDateToUse = today;
    }
    minDateToUse.setHours(0, 0, 0, 0);
    
    return dateObj < minDateToUse;
  };

  const days = getDaysInMonth(currentMonth);
  const monthYear = currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  return (
    <div className="datetime-picker">
      <div className="datetime-inputs">
        <div className="date-input-wrapper" ref={calendarRef}>
          <button
            type="button"
            className="date-input"
            onClick={() => setShowCalendar(!showCalendar)}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path
                d="M12.6667 2.66675H3.33333C2.59695 2.66675 2 3.2637 2 4.00008V13.3334C2 14.0698 2.59695 14.6667 3.33333 14.6667H12.6667C13.403 14.6667 14 14.0698 14 13.3334V4.00008C14 3.2637 13.403 2.66675 12.6667 2.66675Z"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M10.6667 1.33325V3.99992"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M5.33333 1.33325V3.99992"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M2 6.66675H14"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span>{formatDate(date)}</span>
          </button>

          {showCalendar && (
            <div className="calendar-dropdown">
              <div className="calendar-header">
                <button
                  type="button"
                  className="calendar-nav"
                  onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
                >
                  ‹
                </button>
                <span className="calendar-month">{monthYear}</span>
                <button
                  type="button"
                  className="calendar-nav"
                  onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
                >
                  ›
                </button>
              </div>

              <div className="calendar-weekdays">
                {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
                  <div key={day} className="calendar-weekday">{day}</div>
                ))}
              </div>

              <div className="calendar-days">
                {days.map((dayObj, index) => (
                  <button
                    key={index}
                    type="button"
                    className={`calendar-day ${!dayObj.isCurrentMonth ? 'other-month' : ''} ${isToday(dayObj.date) ? 'today' : ''} ${isSelected(dayObj.date) ? 'selected' : ''} ${isDisabled(dayObj.date) ? 'disabled' : ''}`}
                    onClick={() => handleDateSelect(dayObj.date)}
                    disabled={isDisabled(dayObj.date)}
                  >
                    {dayObj.day}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="time-input-wrapper">
          <div className="time-input-container">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="time-icon-left">
              <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.5" />
              <path d="M8 4V8L10.5 9.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            <input
              type="time"
              className="time-input"
              value={time}
              onChange={(e) => onTimeChange(e.target.value)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DateTimePicker;
