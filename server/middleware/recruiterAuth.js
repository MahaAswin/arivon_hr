const jwt = require('jsonwebtoken');
const Recruiter = require('../models/Recruiter');

module.exports = async (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Check if the user is a recruiter
    const recruiter = await Recruiter.findById(decoded.id);
    if (!recruiter) {
      return res.status(401).json({ message: 'Not authorized as a recruiter' });
    }

    req.recruiter = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};
