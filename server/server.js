require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');

const authRoutes = require('./routes/authRoutes');
const profileRoutes = require('./routes/profileRoutes');
const jobRoutes = require('./routes/jobRoutes');
const atsRoutes = require('./routes/atsRoutes');
const recruiterRoutes = require('./routes/recruiterRoutes'); // New recruiter routes
const User = require('./models/User'); 
const Recruiter = require('./models/Recruiter');
const RecruiterProfile = require('./models/RecruiterProfile');
const Job = require('./models/Job');

const app = express();

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads', 'resumes');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

const recruiterUploads = ['profiles', 'logos'].map(d => path.join(__dirname, 'uploads', 'recruiter', d));
recruiterUploads.forEach(dir => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/ats', atsRoutes);
app.use('/api/recruiter', recruiterRoutes); // Recruiter module routes

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('[Global Error Handler]:', err);
  res.status(500).json({ 
    message: 'Server Error', 
    error: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

// Health Check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected' 
  });
});

// Database Connection and Server Startup
const startServer = async () => {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Connected');

    // Explicitly create collections to ensure they exist (fixes "not creating table" issue)
    try {
      await User.createCollection();
      await Recruiter.createCollection();
      await RecruiterProfile.createCollection();
      await Job.createCollection();
      console.log('Core Collections (User, Recruiter, Job) ensured and automatic');
    } catch (err) {
      console.log('Collection initialization notice:', err.message);
    }

    const PORT = process.env.PORT || 5000;
    const server = app.listen(PORT, '0.0.0.0', () => {
      console.log(`Server running on port ${PORT} (IPv4/IPv6)`);
    });

    server.on('error', (err) => {
      console.error('Server failed to start:', err.message);
    });
  } catch (err) {
    console.error('CRITICAL: MongoDB Connection Error:', err.message);
    process.exit(1); // Exit if DB connection fails
  }
};

startServer();
