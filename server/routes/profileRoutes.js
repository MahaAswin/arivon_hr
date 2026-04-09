const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { getProfile, updateProfile, completeOnboarding } = require('../controllers/profileController');
const auth = require('../middleware/auth');
const checkProfileCompletion = require('../middleware/checkProfile');

// Configure multer for resume uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/resumes/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'resume-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /pdf|doc|docx/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only PDF and DOC files are allowed'));
    }
  }
});

router.get('/me', auth, getProfile);
router.put('/update', auth, updateProfile);
router.post('/complete', auth, checkProfileCompletion, upload.single('resume'), completeOnboarding);

module.exports = router;
