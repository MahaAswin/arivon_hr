const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    console.log(`[Register] Attempting to register user: ${email}`);
    
    // Check if user exists
    let user = await User.findOne({ email });
    if (user) {
      console.log(`[Register] User already exists: ${email}`);
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    console.log(`[Register] Hashing password for: ${email}`);
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    user = new User({
      name,
      email,
      password: hashedPassword
    });

    console.log(`[Register] Saving user to database: ${email}`);
    await user.save();
    console.log(`[Register] User saved successfully: ${user._id}`);

    // Create token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    const userResponse = user.toObject();
    delete userResponse.password;

    res.status(201).json({ token, user: userResponse });
  } catch (error) {
    console.error(`[Register] Error during registration:`, error);
    res.status(500).json({ 
      message: error.message || 'Server Error', 
      error: error.name || 'UnknownError',
      details: error.errors ? Object.keys(error.errors).map(k => error.errors[k].message) : undefined
    });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log(`[Login] Attempting login for: ${email}`);

    const user = await User.findOne({ email });
    if (!user) {
      console.log(`[Login] User not found: ${email}`);
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log(`[Login] Password mismatch for: ${email}`);
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    const userResponse = user.toObject();
    delete userResponse.password;

    console.log(`[Login] Successful login: ${email}`);
    res.json({ token, user: userResponse });
  } catch (error) {
    console.error(`[Login] Error during login:`, error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

module.exports = { register, login };
