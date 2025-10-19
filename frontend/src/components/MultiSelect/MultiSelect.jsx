import { useState, useRef, useEffect } from 'react';
import './MultiSelect.css';

const MultiSelect = ({ options = [], selected = [], onChange, onAddNew, placeholder = "Select profiles..." }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddInput, setShowAddInput] = useState(false);
  const [newProfileName, setNewProfileName] = useState('');
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
        setShowAddInput(false);
        setNewProfileName('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleToggle = (profileId) => {
    if (selected.includes(profileId)) {
      onChange(selected.filter(id => id !== profileId));
    } else {
      onChange([...selected, profileId]);
    }
  };

  const handleAddProfile = async () => {
    if (newProfileName.trim()) {
      const newProfile = {
        name: newProfileName.trim(),
      };
      try {
        const createdProfile = await onAddNew(newProfile);
        onChange([...selected, createdProfile._id]);
        setNewProfileName('');
        setShowAddInput(false);
        setSearchTerm('');
      } catch (error) {
        console.error('Error creating profile:', error);
        // Don't close the input on error so user can try again
      }
    }
  };

  const filteredOptions = options.filter(opt =>
    opt.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedCount = selected.length;
  const displayText = selectedCount === 0
    ? placeholder
    : `${selectedCount} profile${selectedCount > 1 ? 's' : ''} selected`;

  return (
    <div className="multi-select" ref={dropdownRef}>
      <button
        type="button"
        className={`multi-select-trigger ${selectedCount > 0 ? 'has-selection' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>{displayText}</span>
        <svg
          className={`dropdown-arrow ${isOpen ? 'open' : ''}`}
          width="12"
          height="12"
          viewBox="0 0 12 12"
          fill="none"
        >
          <path
            d="M2.5 4.5L6 8L9.5 4.5"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {isOpen && (
        <div className="multi-select-dropdown">
          <div className="dropdown-search-container">
            <input
              type="text"
              className="dropdown-search"
              placeholder="Search profiles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              autoFocus
            />
          </div>

          <div className="dropdown-options">
            {filteredOptions.map(option => {
              const isSelected = selected.includes(option._id);
              return (
                <label key={option._id} className="dropdown-option">
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => handleToggle(option._id)}
                  />
                  <span className={isSelected ? 'selected' : ''}>
                    {isSelected && (
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                        <path
                          d="M11.6667 3.5L5.25 9.91667L2.33333 7"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    )}
                    {option.name}
                  </span>
                </label>
              );
            })}
          </div>

          {showAddInput ? (
            <div className="add-profile-input-container">
              <input
                type="text"
                className="add-profile-input"
                placeholder="Enter profile name..."
                value={newProfileName}
                onChange={(e) => setNewProfileName(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddProfile()}
                autoFocus
              />
              <button
                type="button"
                className="btn-add-confirm"
                onClick={handleAddProfile}
              >
                Add
              </button>
            </div>
          ) : (
            <button
              type="button"
              className="btn-add-profile"
              onClick={() => setShowAddInput(true)}
            >
              <span className="add-icon">+</span>
              Add Profile
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default MultiSelect;
