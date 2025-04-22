const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const User = require('./models/User');

const app = express();
app.use(cors());
app.use(bodyParser.json());

mongoose.connect('mongodb://localhost:27017/restaurantApp', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.get('/', (req, res) => {
  res.send('API is working!');
});

// Mock authentication - replace with JWT/session in real use
const TEMP_USER_ID = '661ee14db15f5f19c01a099a'; // replace with real logged-in user ID

// Get profile
app.get('/api/profile', async (req, res) => {
  try {
    const user = await User.findById(TEMP_USER_ID).select('-password');
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update profile
app.put('/api/profile', async (req, res) => {
  try {
    const { name, email, phone } = req.body;
    const user = await User.findByIdAndUpdate(
      TEMP_USER_ID,
      { name, email, phone },
      { new: true }
    );
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Update failed' });
  }
});

// Update password
app.put('/api/settings/password', async (req, res) => {
  try {
    const { password } = req.body;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    await User.findByIdAndUpdate(TEMP_USER_ID, { password: hashedPassword });
    res.sendStatus(200);
  } catch (err) {
    res.status(500).json({ message: 'Password update failed' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
