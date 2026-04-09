const mongoose = require('mongoose');

const ShortlistSchema = new mongoose.Schema({
  recruiterId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Recruiter',
    required: true
  },
  candidateId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, { timestamps: true });

// Ensure a recruiter can only shortlist a candidate once
ShortlistSchema.index({ recruiterId: 1, candidateId: 1 }, { unique: true });

module.exports = mongoose.model('Shortlist', ShortlistSchema);
