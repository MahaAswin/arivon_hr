const express = require('express');
const router = express.Router();
const { getDashboardData, searchAdzunaJobs, applyToJob } = require('../controllers/jobController');
const auth = require('../middleware/auth');

router.get('/dashboard', auth, getDashboardData);
router.get('/search', auth, searchAdzunaJobs);
router.post('/:jobId/apply', auth, applyToJob);

module.exports = router;
