const mongoose = require('mongoose');

const JobSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  requiredSkills: {
    type: [String],
    default: []
  },
  location: {
    type: String,
    required: true
  },
  salaryRange: {
    type: String,
    default: ''
  },
  recruiterId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Recruiter',
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Job', JobSchema);
