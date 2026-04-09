const Recruiter = require('../models/Recruiter');
const RecruiterProfile = require('../models/RecruiterProfile');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Register Recruiter
const register = async (req, res) => {
  try {
    const { recruiterName, email, password } = req.body;

    let recruiter = await Recruiter.findOne({ email });
    if (recruiter) {
      return res.status(400).json({ message: 'Recruiter already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    recruiter = new Recruiter({
      recruiterName,
      email,
      password: hashedPassword
    });

    await recruiter.save();

    // Initialize profile
    const profile = new RecruiterProfile({
      recruiterId: recruiter._id,
      recruiterName
    });
    await profile.save();

    const token = jwt.sign({ id: recruiter._id, role: 'recruiter' }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({ token, recruiter: { id: recruiter._id, recruiterName, email } });
  } catch (error) {
    res.status(500).json({ message: 'Registration failed', error: error.message });
  }
};

// Login Recruiter
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const recruiter = await Recruiter.findOne({ email });
    if (!recruiter) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, recruiter.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: recruiter._id, role: 'recruiter' }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.json({ token, recruiter: { id: recruiter._id, recruiterName: recruiter.recruiterName, email } });
  } catch (error) {
    res.status(500).json({ message: 'Login failed', error: error.message });
  }
};

// Get Profile
const getProfile = async (req, res) => {
  try {
    const profile = await RecruiterProfile.findOne({ recruiterId: req.recruiter.id }).populate('recruiterId', 'isProfileComplete');
    if (!profile) return res.status(404).json({ message: 'Profile not found' });
    res.json(profile);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update Profile
const updateProfile = async (req, res) => {
  try {
    const updateData = { ...req.body };
    
    // Handle file uploads if present
    if (req.files) {
      if (req.files.recruiterPhoto) {
        updateData.recruiterPhoto = `/uploads/recruiter/profiles/${req.files.recruiterPhoto[0].filename}`;
      }
      if (req.files.companyLogo) {
        updateData.companyLogo = `/uploads/recruiter/logos/${req.files.companyLogo[0].filename}`;
      }
    }

    const profile = await RecruiterProfile.findOneAndUpdate(
      { recruiterId: req.recruiter.id },
      { $set: updateData },
      { new: true, runValidators: true }
    );

    res.json(profile);
  } catch (error) {
    res.status(500).json({ message: 'Profile update failed', error: error.message });
  }
};

// Complete Onboarding
const completeOnboarding = async (req, res) => {
  try {
    const updateData = { ...req.body };
    
    // Handle file uploads
    if (req.files) {
      if (req.files.recruiterPhoto) {
        updateData.recruiterPhoto = `/uploads/recruiter/profiles/${req.files.recruiterPhoto[0].filename}`;
      }
      if (req.files.companyLogo) {
        updateData.companyLogo = `/uploads/recruiter/logos/${req.files.companyLogo[0].filename}`;
      }
    }

    // Update Profile
    const profile = await RecruiterProfile.findOneAndUpdate(
      { recruiterId: req.recruiter.id },
      { $set: updateData },
      { new: true, runValidators: true }
    );

    // Mark Recruiter as complete
    await Recruiter.findByIdAndUpdate(req.recruiter.id, { isProfileComplete: true });

    res.json({ message: 'Onboarding completed successfully', profile });
  } catch (error) {
    res.status(500).json({ message: 'Onboarding completion failed', error: error.message });
  }
};

module.exports = { register, login, getProfile, updateProfile, completeOnboarding };
