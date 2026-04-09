const User = require('../models/User');

const checkProfileCompletion = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // If profile is complete, block access to onboarding
    if (user.isProfileComplete) {
      return res.status(403).json({ 
        message: 'Profile already completed', 
        redirect: '/dashboard' 
      });
    }

    next();
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = checkProfileCompletion;
