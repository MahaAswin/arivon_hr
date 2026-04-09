const mongoose = require('mongoose');

const RecruiterProfileSchema = new mongoose.Schema({
  recruiterId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Recruiter',
    required: true,
    unique: true
  },
  recruiterName: {
    type: String,
    required: true
  },
  recruiterPhoto: {
    type: String,
    default: ''
  },
  companyName: {
    type: String,
    default: ''
  },
  companyLogo: {
    type: String,
    default: ''
  },
  companyWebsite: {
    type: String,
    default: ''
  },
  companyDescription: {
    type: String,
    default: ''
  },
  industry: {
    type: String,
    default: ''
  },
  companySize: {
    type: String,
    default: ''
  },
  location: {
    type: String,
    default: ''
  },
  linkedin: {
    type: String,
    default: ''
  },
  verified: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

module.exports = mongoose.model('RecruiterProfile', RecruiterProfileSchema);
