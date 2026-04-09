const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  atsScore: {
    type: Number,
    default: 0
  },
  // Legacy fields (kept for backward compatibility)
  education: {
    type: String,
    default: ''
  },
  experience: {
    type: String,
    default: 'Beginner'
  },
  favoriteSubjects: {
    type: [String],
    default: []
  },
  strengths: {
    type: [String],
    default: []
  },
  
  // Onboarding fields
  isProfileComplete: {
    type: Boolean,
    default: false
  },
  level: {
    type: String,
    enum: ['2nd Year', '3rd Year', 'Final Year', 'PG', ''],
    default: ''
  },
  branch: {
    type: String,
    default: ''
  },
  cgpa: {
    type: String,
    default: ''
  },
  skills: {
    type: [String],
    default: []
  },
  interests: {
    type: [String],
    default: []
  },
  projects: {
    hasProjects: {
      type: Boolean,
      default: false
    },
    types: {
      type: [String],
      default: []
    },
    count: {
      type: String,
      default: ''
    }
  },
  resumeUrl: {
    type: String,
    default: ''
  }
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);
