const Job = require('../models/Job');
const User = require('../models/User');
const Shortlist = require('../models/Shortlist');

// Dashboard Stats
const getDashboard = async (req, res) => {
  try {
    const recruiterId = req.recruiter.id;
    
    const totalCandidates = await User.countDocuments();
    const shortlistedCandidatesCount = await Shortlist.countDocuments({ recruiterId });
    const activeJobs = await Job.countDocuments({ recruiterId });
    const recentCandidates = await User.find().sort({ createdAt: -1 }).limit(5).select('name email skills atsScore resumeUrl');

    res.json({
      totalCandidates,
      shortlistedCandidates: shortlistedCandidatesCount,
      activeJobs,
      recentCandidates
    });
  } catch (error) {
    res.status(500).json({ message: 'Dashboard failed', error: error.message });
  }
};

// Candidate Search with AI Matching
const getCandidates = async (req, res) => {
  try {
    const { role, skills, minATSScore, jobId } = req.query;
    let query = {};

    if (minATSScore) {
      query.atsScore = { $gte: parseInt(minATSScore) };
    }

    if (skills) {
      const skillArray = skills.split(',');
      query.skills = { $all: skillArray }; // Note: Case-sensitive as per request
    }

    let candidates = await User.find(query).select('name email skills projects atsScore resumeUrl');

    // AI Matching Logic if Job ID is provided
    if (jobId) {
      const job = await Job.findById(jobId);
      if (job && job.requiredSkills.length > 0) {
        candidates = candidates.map(candidate => {
          const matchedSkills = candidate.skills.filter(s => job.requiredSkills.includes(s));
          const matchScore = (matchedSkills.length / job.requiredSkills.length) * 100;
          return { ...candidate.toObject(), matchScore: Math.round(matchScore) };
        });
      }
    }

    res.json(candidates);
  } catch (error) {
    res.status(500).json({ message: 'Search failed', error: error.message });
  }
};

// Candidate Profile View
const getCandidateById = async (req, res) => {
  try {
    const candidate = await User.findById(req.params.id).select('name email skills projects atsScore resumeUrl');
    if (!candidate) return res.status(404).json({ message: 'Candidate not found' });
    res.json(candidate);
  } catch (error) {
    res.status(500).json({ message: 'Fetch failed', error: error.message });
  }
};

// Job Posting
const postJob = async (req, res) => {
  try {
    const { title, description, requiredSkills, location, salaryRange } = req.body;
    const recruiterId = req.recruiter.id;

    const job = new Job({
      title,
      description,
      requiredSkills,
      location,
      salaryRange,
      recruiterId
    });

    await job.save();
    res.status(201).json(job);
  } catch (error) {
    res.status(500).json({ message: 'Job posting failed', error: error.message });
  }
};

// Get Recruiter Jobs
const getJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ recruiterId: req.recruiter.id });
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: 'Fetch jobs failed', error: error.message });
  }
};

// Shortlist (Add to Cart)
const shortlistCandidate = async (req, res) => {
  try {
    const { candidateId } = req.body;
    const recruiterId = req.recruiter.id;

    const shortlist = new Shortlist({ recruiterId, candidateId });
    await shortlist.save();
    
    res.status(201).json({ message: 'Candidate added to cart / shortlist', shortlist });
  } catch (error) {
    res.status(500).json({ message: 'Shortlist failed', error: error.message });
  }
};

// Get Shortlist
const getShortlist = async (req, res) => {
  try {
    const list = await Shortlist.find({ recruiterId: req.recruiter.id }).populate('candidateId', 'name email skills atsScore resumeUrl');
    res.json(list);
  } catch (error) {
    res.status(500).json({ message: 'Fetch shortlist failed', error: error.message });
  }
};

// Remove from Shortlist
const removeFromShortlist = async (req, res) => {
  try {
    const { id } = req.params;
    const recruiterId = req.recruiter.id;

    const result = await Shortlist.findOneAndDelete({ _id: id, recruiterId });
    if (!result) return res.status(404).json({ message: 'Entry not found or unauthorized' });

    res.json({ message: 'Candidate removed from cart successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Removal failed', error: error.message });
  }
};

// Send Candidate Email (Simulated)
const sendCandidateEmail = async (req, res) => {
  try {
    const { candidateId, subject, content } = req.body;
    const recruiterId = req.recruiter.id;

    // In a real app, you would use nodemailer here.
    // We'll log it and simulate "AI Dispatching" delay.
    console.log(`[Neural Dispatch] From: ${recruiterId} To: ${candidateId}`);
    console.log(`Subject: ${subject}`);
    console.log(`Content: ${content}`);

    // Wait 1.5s to simulate "Dispatching"
    await new Promise(resolve => setTimeout(resolve, 1500));

    res.json({ message: 'Mail Dispatched successfully via Arivon Neural Network' });
  } catch (error) {
    res.status(500).json({ message: 'Dispatch failed', error: error.message });
  }
};

const getApplications = async (req, res) => {
  try {
    const Application = require('../models/Application');
    const applications = await Application.find({ recruiterId: req.user.id })
      .populate('jobId', 'title')
      .populate('candidateId', 'name email atsScore skills resumeUrl')
      .sort({ appliedAt: -1 });
    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: 'Fetch Applications Error', error: error.message });
  }
};

const updateApplicationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const Application = require('../models/Application');

    const application = await Application.findOneAndUpdate(
      { _id: id, recruiterId: req.user.id },
      { status },
      { new: true }
    );

    if (!application) return res.status(404).json({ message: 'Application not found' });
    res.json(application);
  } catch (error) {
    res.status(500).json({ message: 'Update Error', error: error.message });
  }
};

module.exports = { 
  getDashboard, 
  getCandidates, 
  getCandidateById, 
  postJob, 
  getJobs, 
  shortlistCandidate, 
  getShortlist,
  removeFromShortlist,
  sendCandidateEmail,
  getApplications,
  updateApplicationStatus
};
