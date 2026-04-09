const axios = require('axios');
const jobs = require('../data/jobs.json');
const User = require('../models/User');

const getMatches = async (userSkills) => {
  return jobs.map(job => {
    const requiredSkills = job.skills.map(s => s.toLowerCase());
    const matchedSkills = userSkills.filter(s => requiredSkills.includes(s.toLowerCase()));
    
    const matchPercentage = requiredSkills.length > 0 
      ? Math.round((matchedSkills.length / requiredSkills.length) * 100) 
      : 0;

    const missingSkills = job.skills.filter(s => !userSkills.map(us => us.toLowerCase()).includes(s.toLowerCase()));

    return {
      title: job.title,
      matchPercentage,
      matchedSkills,
      missingSkills
    };
  }).sort((a, b) => b.matchPercentage - a.matchPercentage);
};

const getDashboardData = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const matches = await getMatches(user.skills);
    
    // Calculate readiness score
    // Readiness = Average of top 3 match percentages + some base for having skills
    const topMatches = matches.slice(0, 3);
    const avgMatch = topMatches.reduce((acc, curr) => acc + curr.matchPercentage, 0) / (topMatches.length || 1);
    
    const readinessScore = Math.min(Math.round(avgMatch), 100);

    res.json({
      profile: {
        name: user.name,
        email: user.email,
        educationLevel: user.educationLevel,
        skills: user.skills,
        goal: user.goal
      },
      jobMatches: matches,
      readinessScore: `${readinessScore}% Ready`
    });
  } catch (error) {
    res.status(500).json({ message: 'Dashboard Error', error: error.message });
  }
};

const searchAdzunaJobs = async (req, res) => {
  try {
    const { role, location } = req.query;
    const appId = process.env.ADZUNA_APP_ID;
    const appKey = process.env.ADZUNA_APP_KEY;
    const country = 'in'; // Default to India as discussed

    if (!appId || !appKey) {
      console.error("Adzuna API keys missing in .env");
      return res.status(500).json({ message: "Job search service misconfigured" });
    }

    const what = encodeURIComponent(role || '');
    const where = encodeURIComponent(location || '');
    
    const url = `https://api.adzuna.com/v1/api/jobs/${country}/search/1?app_id=${appId}&app_key=${appKey}&what=${what}&where=${where}&content-type=application/json`;

    const response = await axios.get(url);
    
    const normalizedJobs = response.data.results.map(job => ({
      id: job.id,
      title: job.title.replace(/<\/?[^>]+(>|$)/g, ""), // Remove HTML tags if any
      company: job.company.display_name,
      location: job.location.display_name,
      description: job.description.replace(/<\/?[^>]+(>|$)/g, ""),
      redirect_url: job.redirect_url,
      extractedSkills: job.category.label ? [job.category.label] : [], // Adzuna doesn't provide granular skills easily
      postedDate: job.created
    }));

    res.json(normalizedJobs);
  } catch (error) {
    console.error("Adzuna API Error:", error.message);
    res.status(500).json({ message: "Failed to fetch jobs from Adzuna", error: error.message });
  }
};

const getAllInternalJobs = async (req, res) => {
  try {
    const JobModel = require('../models/Job');
    const jobs = await JobModel.find().populate('recruiterId', 'companyName companyLogo');
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching internal jobs', error: error.message });
  }
};

const applyToJob = async (req, res) => {
  try {
    const { jobId } = req.params;
    const user = await User.findById(req.user.id);
    const JobModel = require('../models/Job');
    const Application = require('../models/Application');

    const job = await JobModel.findById(jobId);
    if (!job) return res.status(404).json({ message: 'Job not found' });

    // Check if profile is complete
    if (!user.resumeUrl) {
      return res.status(400).json({ message: 'Please upload your resume in Profile settings before applying.' });
    }

    const application = new Application({
      jobId,
      candidateId: user._id,
      recruiterId: job.recruiterId,
      resumeUrl: user.resumeUrl,
      status: 'pending'
    });

    await application.save();
    res.status(201).json({ message: 'Application submitted successfully!' });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'You have already applied to this job.' });
    }
    res.status(500).json({ message: 'Application Error', error: error.message });
  }
};

module.exports = { getDashboardData, searchAdzunaJobs, applyToJob };
