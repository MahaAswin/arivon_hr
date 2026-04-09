const mongoose = require('mongoose');

const ApplicationSchema = new mongoose.Schema({
  jobId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job',
    required: true
  },
  candidateId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  recruiterId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Recruiter',
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected'],
    default: 'pending'
  },
  resumeUrl: {
    type: String,
    required: true
  },
  message: {
    type: String,
    default: "I am writing to express my strong interest in this position. My skills and experience align well with the requirements, and I am excited about the possibility of contributing to your team."
  },
  appliedAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

// Ensure a candidate can only apply once to the same job
ApplicationSchema.index({ jobId: 1, candidateId: 1 }, { unique: true });

module.exports = mongoose.model('Application', ApplicationSchema);
