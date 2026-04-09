const express = require('express');
const router = express.Router();
const { getDashboardData, searchAdzunaJobs } = require('../controllers/jobController');
const auth = require('../middleware/auth');

router.get('/dashboard', auth, getDashboardData);
router.get('/search', auth, searchAdzunaJobs);

module.exports = router;
