const User = require('../models/User');
const path = require('path');
const fs = require('fs');

const getProfile = async (req, res) => {
  try {
    console.log('=== Get Profile Request ===');
    console.log('User ID:', req.user.id);
    
    const user = await User.findById(req.user.id).select('-password');
    
    if (!user) {
      console.error('User not found:', req.user.id);
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Self-healing: Update isProfileComplete flag for old users
    if (user && !user.isProfileComplete) {
      const hasAcademic = Boolean(user.level) || Boolean(user.branch) || Boolean(user.cgpa);
      const hasProfessional = Boolean(user.education) && Boolean(user.experience);
      
      const isComplete = (user.skills?.length > 0) && (user.interests?.length > 0) && (hasAcademic || hasProfessional);
      if (isComplete) {
        user.isProfileComplete = true;
        await user.save();
      }
    }
    
    // Ensure skills and interests are always arrays
    if (user) {
      if (typeof user.skills === 'string') {
        try {
          user.skills = JSON.parse(user.skills);
          console.log('Parsed skills from string');
        } catch (e) {
          console.error('Failed to parse skills:', e);
          user.skills = [];
        }
      }
      if (typeof user.interests === 'string') {
        try {
          user.interests = JSON.parse(user.interests);
          console.log('Parsed interests from string');
        } catch (e) {
          console.error('Failed to parse interests:', e);
          user.interests = [];
        }
      }
      // Ensure they are arrays
      user.skills = Array.isArray(user.skills) ? user.skills : [];
      user.interests = Array.isArray(user.interests) ? user.interests : [];
      
      console.log('Skills:', user.skills);
      console.log('Interests:', user.interests);
    }
    
    res.json(user);
  } catch (error) {
    console.error('=== Get Profile Error ===');
    console.error('Error:', error);
    console.error('Stack:', error.stack);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const updateProfile = async (req, res) => {
  try {
    console.log('=== Profile Update Request ===');
    console.log('Incoming Data:', JSON.stringify(req.body, null, 2));
    
    let { skills, interests, education, experience } = req.body;
    
    // Parse skills if it's a string
    if (typeof skills === 'string') {
      try {
        skills = JSON.parse(skills);
        console.log('Parsed skills from string:', skills);
      } catch (e) {
        console.error('Failed to parse skills:', e);
        skills = [];
      }
    }
    
    // Parse interests if it's a string
    if (typeof interests === 'string') {
      try {
        interests = JSON.parse(interests);
        console.log('Parsed interests from string:', interests);
      } catch (e) {
        console.error('Failed to parse interests:', e);
        interests = [];
      }
    }
    
    // Ensure they are arrays
    skills = Array.isArray(skills) ? skills : [];
    interests = Array.isArray(interests) ? interests : [];
    
    console.log('Final skills:', skills);
    console.log('Final interests:', interests);
    
    // User can either be a student (level & branch) or professional (education & experience)
    const hasAcademic = Boolean(req.body.level) || Boolean(req.body.branch) || Boolean(req.body.cgpa);
    const hasProfessional = Boolean(education) && Boolean(experience);
    
    // Calculate completeness only if not already passed as true by frontend
    let isProfileComplete = req.body.isProfileComplete === true;
    
    if (!isProfileComplete) {
      isProfileComplete = !!(
        skills?.length > 0 && 
        interests?.length > 0 && 
        (hasAcademic || hasProfessional)
      );
    }

    console.log('Profile complete status:', isProfileComplete);

    // Extract only valid fields from req.body to prevent _id modification errors
    // and errors related to removed schema fields.
    const allowedFields = ['name', 'education', 'experience', 'favoriteSubjects', 'strengths', 'level', 'branch', 'cgpa', 'projects', 'resumeUrl'];
    
    const updateData = {
      skills,
      interests,
      isProfileComplete
    };

    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        updateData[field] = req.body[field];
      }
    });

    console.log('Updating with data:', JSON.stringify(updateData, null, 2));

    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { $set: updateData },
      { new: true, runValidators: true }
    ).select('-password');

    if (!updatedUser) {
      console.error('User not found:', req.user.id);
      return res.status(404).json({ message: 'User not found' });
    }

    console.log('Update successful');
    res.json(updatedUser);
  } catch (error) {
    console.error('=== Profile Update Error ===');
    console.error('Error:', error);
    console.error('Stack:', error.stack);
    res.status(500).json({ 
      message: 'Profile update failed', 
      error: error.message 
    });
  }
};

// Complete onboarding with all data
const completeOnboarding = async (req, res) => {
  try {
    console.log('=== Complete Onboarding Request ===');
    const userId = req.user.id;
    const onboardingData = req.body;
    console.log('User ID:', userId);
    console.log('Incoming Data:', JSON.stringify(onboardingData, null, 2));

    // Handle resume file if uploaded
    let resumeUrl = '';
    if (req.file) {
      resumeUrl = `/uploads/resumes/${req.file.filename}`;
      console.log('Resume uploaded:', resumeUrl);
    }

    // Parse skills if it's a string
    let skillsData = onboardingData.skills;
    if (typeof skillsData === 'string') {
      try {
        skillsData = JSON.parse(skillsData);
        console.log('Parsed skills from string:', skillsData);
      } catch (e) {
        console.error('Failed to parse skills:', e);
        skillsData = [];
      }
    }
    skillsData = Array.isArray(skillsData) ? skillsData : [];

    // Parse interests if it's a string
    let interestsData = onboardingData.interests;
    if (typeof interestsData === 'string') {
      try {
        interestsData = JSON.parse(interestsData);
        console.log('Parsed interests from string:', interestsData);
      } catch (e) {
        console.error('Failed to parse interests:', e);
        interestsData = [];
      }
    }
    interestsData = Array.isArray(interestsData) ? interestsData : [];

    // Parse projects data if it's a string
    let projectsData = onboardingData.projects;
    if (typeof projectsData === 'string') {
      try {
        projectsData = JSON.parse(projectsData);
        console.log('Parsed projects from string:', projectsData);
      } catch (e) {
        console.error('Failed to parse projects:', e);
        projectsData = { hasProjects: false, types: [], count: '' };
      }
    }

    const updateData = {
      level: onboardingData.level,
      branch: onboardingData.branch,
      cgpa: onboardingData.cgpa,
      skills: skillsData,
      interests: interestsData,
      projects: projectsData,
      resumeUrl: resumeUrl || onboardingData.resumeUrl || '',
      isProfileComplete: true
    };

    console.log('Final update data:', JSON.stringify(updateData, null, 2));

    // Update user with all onboarding data
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updateData },
      { new: true, runValidators: true }
    ).select('-password');

    if (!updatedUser) {
      console.error('User not found:', userId);
      return res.status(404).json({ message: 'User not found' });
    }

    console.log('Onboarding completed successfully');
    res.json({ 
      message: 'Onboarding completed successfully', 
      user: updatedUser 
    });
  } catch (error) {
    console.error('=== Onboarding Error ===');
    console.error('Error:', error);
    console.error('Stack:', error.stack);
    res.status(500).json({ 
      message: 'Failed to complete onboarding', 
      error: error.message 
    });
  }
};

module.exports = { getProfile, updateProfile, completeOnboarding };
