const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { analyzeATS } = require('../controllers/atsController');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // We utilize the same resumes folder logic
    cb(null, 'uploads/resumes/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'ats-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (ext === '.pdf' || file.mimetype === 'application/pdf') {
      return cb(null, true);
    }
    return cb(new Error('Only PDF files are allowed'));
  }
});

router.post('/analyze', upload.single('resume'), analyzeATS);

module.exports = router;
