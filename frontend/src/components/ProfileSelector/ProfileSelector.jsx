import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Search, Check, Plus, Trash2 } from 'lucide-react';
import './ProfileSelector.css';

const ProfileSelector = ({ profiles, selectedProfile, onProfileChange, onAddProfile, onDeleteProfile }) => {
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

  const handleAddProfile = () => {
    if (newProfileName.trim()) {
      const newProfile = {
        _id: Date.now().toString(),
        name: newProfileName.trim(),
      };
      onAddProfile(newProfile);
      setNewProfileName('');
      setShowAddInput(false);
      setSearchTerm('');
    }
  };

  const handleDeleteProfile = (e, profileId) => {
    e.stopPropagation(); // Prevent the profile selection
    if (window.confirm('Are you sure you want to delete this profile?')) {
      onDeleteProfile(profileId);
    }
  };

  const filteredProfiles = profiles.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedProfileName = selectedProfile
    ? profiles.find(p => p._id === selectedProfile)?.name || 'Select current profile...'
    : 'Select current profile...';

  return (
    <div className="profile-selector" ref={dropdownRef}>
      <button
        type="button"
        className="profile-selector-trigger"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>{selectedProfileName}</span>
        <ChevronDown 
          className={`dropdown-arrow ${isOpen ? 'open' : ''}`}
          size={12}
        />
      </button>

      {isOpen && (
        <div className="profile-selector-dropdown">
          <div className="dropdown-search-container">
            <Search size={16} className="search-icon" />
            <input
              type="text"
              className="dropdown-search"
              placeholder="Search current profile..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              autoFocus
            />
          </div>

          <div className="dropdown-options">
            {filteredProfiles.map(profile => (
              <div
                key={profile._id}
                className={`dropdown-option ${selectedProfile === profile._id ? 'selected' : ''}`}
                onClick={() => {
                  onProfileChange(profile._id);
                  setIsOpen(false);
                }}
              >
                {selectedProfile === profile._id && (
                  <Check size={14} className="check-icon" />
                )}
                <span className="profile-name">{profile.name}</span>
                <button
                  type="button"
                  className="delete-profile-btn"
                  onClick={(e) => handleDeleteProfile(e, profile._id)}
                  title="Delete profile"
                >
                  <Trash2 size={12} />
                </button>
              </div>
            ))}
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
              <Plus size={16} className="add-icon" />
              Add Profile
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default ProfileSelector;
