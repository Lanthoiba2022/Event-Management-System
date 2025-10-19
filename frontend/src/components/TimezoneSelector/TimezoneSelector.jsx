import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Search, Check } from 'lucide-react';
import './TimezoneSelector.css';

const TIMEZONES = [
  // North America
  { value: 'America/New_York', label: 'Eastern Time (ET) - New York' },
  { value: 'America/Chicago', label: 'Central Time (CT) - Chicago' },
  { value: 'America/Denver', label: 'Mountain Time (MT) - Denver' },
  { value: 'America/Los_Angeles', label: 'Pacific Time (PT) - Los Angeles' },
  { value: 'America/Anchorage', label: 'Alaska Time (AKST) - Anchorage' },
  { value: 'Pacific/Honolulu', label: 'Hawaii Time (HST) - Honolulu' },
  { value: 'America/Toronto', label: 'Eastern Time (ET) - Toronto' },
  { value: 'America/Vancouver', label: 'Pacific Time (PT) - Vancouver' },
  { value: 'America/Mexico_City', label: 'Central Time (CT) - Mexico City' },

  // Europe
  { value: 'Europe/London', label: 'Greenwich Mean Time (GMT) - London' },
  { value: 'Europe/Paris', label: 'Central European Time (CET) - Paris' },
  { value: 'Europe/Berlin', label: 'Central European Time (CET) - Berlin' },
  { value: 'Europe/Rome', label: 'Central European Time (CET) - Rome' },
  { value: 'Europe/Madrid', label: 'Central European Time (CET) - Madrid' },
  { value: 'Europe/Amsterdam', label: 'Central European Time (CET) - Amsterdam' },
  { value: 'Europe/Zurich', label: 'Central European Time (CET) - Zurich' },
  { value: 'Europe/Vienna', label: 'Central European Time (CET) - Vienna' },
  { value: 'Europe/Stockholm', label: 'Central European Time (CET) - Stockholm' },
  { value: 'Europe/Oslo', label: 'Central European Time (CET) - Oslo' },
  { value: 'Europe/Copenhagen', label: 'Central European Time (CET) - Copenhagen' },
  { value: 'Europe/Helsinki', label: 'Eastern European Time (EET) - Helsinki' },
  { value: 'Europe/Athens', label: 'Eastern European Time (EET) - Athens' },
  { value: 'Europe/Moscow', label: 'Moscow Time (MSK) - Moscow' },
  { value: 'Europe/Dublin', label: 'Greenwich Mean Time (GMT) - Dublin' },
  { value: 'Europe/Lisbon', label: 'Western European Time (WET) - Lisbon' },

  // Asia
  { value: 'Asia/Tokyo', label: 'Japan Standard Time (JST) - Tokyo' },
  { value: 'Asia/Seoul', label: 'Korea Standard Time (KST) - Seoul' },
  { value: 'Asia/Shanghai', label: 'China Standard Time (CST) - Shanghai' },
  { value: 'Asia/Beijing', label: 'China Standard Time (CST) - Beijing' },
  { value: 'Asia/Hong_Kong', label: 'Hong Kong Time (HKT) - Hong Kong' },
  { value: 'Asia/Singapore', label: 'Singapore Time (SGT) - Singapore' },
  { value: 'Asia/Kolkata', label: 'India Standard Time (IST) - Mumbai/Delhi' },
  { value: 'Asia/Dubai', label: 'Gulf Standard Time (GST) - Dubai' },
  { value: 'Asia/Bangkok', label: 'Indochina Time (ICT) - Bangkok' },
  { value: 'Asia/Jakarta', label: 'Western Indonesia Time (WIB) - Jakarta' },
  { value: 'Asia/Manila', label: 'Philippine Time (PHT) - Manila' },
  { value: 'Asia/Kuala_Lumpur', label: 'Malaysia Time (MYT) - Kuala Lumpur' },
  { value: 'Asia/Taipei', label: 'Taiwan Time (CST) - Taipei' },
  { value: 'Asia/Karachi', label: 'Pakistan Standard Time (PKT) - Karachi' },
  { value: 'Asia/Dhaka', label: 'Bangladesh Standard Time (BST) - Dhaka' },
  { value: 'Asia/Tehran', label: 'Iran Standard Time (IRST) - Tehran' },
  { value: 'Asia/Jerusalem', label: 'Israel Standard Time (IST) - Jerusalem' },

  // Australia & Oceania
  { value: 'Australia/Sydney', label: 'Australian Eastern Time (AEST) - Sydney' },
  { value: 'Australia/Melbourne', label: 'Australian Eastern Time (AEST) - Melbourne' },
  { value: 'Australia/Brisbane', label: 'Australian Eastern Time (AEST) - Brisbane' },
  { value: 'Australia/Perth', label: 'Australian Western Time (AWST) - Perth' },
  { value: 'Australia/Adelaide', label: 'Australian Central Time (ACST) - Adelaide' },
  { value: 'Australia/Darwin', label: 'Australian Central Time (ACST) - Darwin' },
  { value: 'Pacific/Auckland', label: 'New Zealand Time (NZST) - Auckland' },
  { value: 'Pacific/Fiji', label: 'Fiji Time (FJT) - Suva' },

  // Africa
  { value: 'Africa/Cairo', label: 'Eastern European Time (EET) - Cairo' },
  { value: 'Africa/Johannesburg', label: 'South Africa Time (SAST) - Johannesburg' },
  { value: 'Africa/Lagos', label: 'West Africa Time (WAT) - Lagos' },
  { value: 'Africa/Nairobi', label: 'East Africa Time (EAT) - Nairobi' },
  { value: 'Africa/Casablanca', label: 'Western European Time (WET) - Casablanca' },

  // South America
  { value: 'America/Sao_Paulo', label: 'Brasília Time (BRT) - São Paulo' },
  { value: 'America/Buenos_Aires', label: 'Argentina Time (ART) - Buenos Aires' },
  { value: 'America/Lima', label: 'Peru Time (PET) - Lima' },
  { value: 'America/Bogota', label: 'Colombia Time (COT) - Bogotá' },
  { value: 'America/Santiago', label: 'Chile Time (CLT) - Santiago' },
  { value: 'America/Caracas', label: 'Venezuela Time (VET) - Caracas' },
];

const TimezoneSelector = ({ selectedTimezone, onTimezoneChange, placeholder = "Select timezone..." }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
        setSearchTerm('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredTimezones = TIMEZONES.filter(tz =>
    tz.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tz.value.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Group timezones by region for better organization
  const groupedTimezones = filteredTimezones.reduce((groups, tz) => {
    const region = tz.value.split('/')[0];
    if (!groups[region]) {
      groups[region] = [];
    }
    groups[region].push(tz);
    return groups;
  }, {});

  const selectedTimezoneLabel = selectedTimezone
    ? TIMEZONES.find(tz => tz.value === selectedTimezone)?.label || selectedTimezone
    : placeholder;

  return (
    <div className="timezone-selector" ref={dropdownRef}>
      <button
        type="button"
        className="timezone-selector-trigger"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>{selectedTimezoneLabel}</span>
        <ChevronDown 
          className={`dropdown-arrow ${isOpen ? 'open' : ''}`}
          size={12}
        />
      </button>

      {isOpen && (
        <div className="timezone-selector-dropdown">
          <div className="dropdown-search-container">
            <Search size={16} className="search-icon" />
            <input
              type="text"
              className="dropdown-search"
              placeholder="Search timezone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              autoFocus
            />
          </div>

          <div className="dropdown-options">
            {Object.entries(groupedTimezones).map(([region, timezones]) => (
              <div key={region} className="timezone-group">
                <div className="timezone-group-header">
                  {region.charAt(0).toUpperCase() + region.slice(1)}
                </div>
                {timezones.map(timezone => (
                  <button
                    key={timezone.value}
                    className={`dropdown-option ${selectedTimezone === timezone.value ? 'selected' : ''}`}
                    onClick={() => {
                      onTimezoneChange(timezone.value);
                      setIsOpen(false);
                      setSearchTerm('');
                    }}
                  >
                    {selectedTimezone === timezone.value && (
                      <Check size={14} className="check-icon" />
                    )}
                    <span>{timezone.label}</span>
                  </button>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TimezoneSelector;
