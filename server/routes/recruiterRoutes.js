const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const { 
  register, 
  login, 
  getProfile, 
  updateProfile,
  completeOnboarding
} = require('../controllers/recruiterController');

const {
  getDashboard,
  getCandidates,
  getCandidateById,
  postJob,
  getJobs,
  shortlistCandidate,
  getShortlist,
  removeFromShortlist,
  sendCandidateEmail
} = require('../controllers/recruiterOpsController');

const recruiterAuth = require('../middleware/recruiterAuth');

// Configure Multer for Recruiter Photos and Company Logos
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let dest = 'uploads/recruiter/';
    if (file.fieldname === 'recruiterPhoto') dest += 'profiles/';
    else if (file.fieldname === 'companyLogo') dest += 'logos/';
    
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest, { recursive: true });
    }
    cb(null, dest);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    if (mimetype && extname) return cb(null, true);
    cb(new Error('Only images are allowed'));
  }
});

// Authentication
router.post('/register', register);
router.post('/login', login);

// Profile
router.get('/profile', recruiterAuth, getProfile);
router.put('/profile', recruiterAuth, upload.fields([
  { name: 'recruiterPhoto', maxCount: 1 },
  { name: 'companyLogo', maxCount: 1 }
]), updateProfile);

// Dashboard
router.get('/dashboard', recruiterAuth, getDashboard);

// Candidates
router.get('/candidates', recruiterAuth, getCandidates);
router.get('/candidate/:id', recruiterAuth, getCandidateById);

// Jobs
router.post('/jobs', recruiterAuth, postJob);
router.get('/jobs', recruiterAuth, getJobs);

// Shortlist (Cart)
router.get('/shortlist', recruiterAuth, getShortlist);
router.delete('/shortlist/:id', recruiterAuth, removeFromShortlist);
router.post('/shortlist/send-email', recruiterAuth, sendCandidateEmail);

router.post('/onboarding', recruiterAuth, upload.fields([
  { name: 'recruiterPhoto', maxCount: 1 },
  { name: 'companyLogo', maxCount: 1 }
]), completeOnboarding);

module.exports = router;
