import mongoose from 'mongoose';

const profileSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Profile name is required'],
    trim: true,
    minlength: [1, 'Profile name must be at least 1 character long'],
    maxlength: [100, 'Profile name cannot exceed 100 characters']
  }
}, {
  timestamps: true
});

const Profile = mongoose.model('Profile', profileSchema);

export default Profile;
