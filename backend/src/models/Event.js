import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema({
  profiles: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Profile',
    required: [true, 'At least one profile is required']
  }],
  timezone: {
    type: String,
    required: [true, 'Timezone is required'],
    trim: true
  },
  startDateTime: {
    type: String,
    required: [true, 'Start date and time is required'],
    trim: true
  },
  endDateTime: {
    type: String,
    required: [true, 'End date and time is required'],
    trim: true
  }
}, {
  timestamps: true
});

// Custom validation to ensure endDateTime is after startDateTime
eventSchema.pre('save', function(next) {
  const startDate = new Date(this.startDateTime);
  const endDate = new Date(this.endDateTime);
  
  if (endDate <= startDate) {
    const error = new Error('End date and time must be after start date and time');
    return next(error);
  }
  
  next();
});

const Event = mongoose.model('Event', eventSchema);

export default Event;
