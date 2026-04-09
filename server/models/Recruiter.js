const mongoose = require('mongoose');

const RecruiterSchema = new mongoose.Schema({
  recruiterName: {
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
  role: {
    type: String,
    default: 'recruiter'
  },
  isProfileComplete: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

module.exports = mongoose.model('Recruiter', RecruiterSchema);
