const express = require('express');
const multer = require('multer');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');

const app = express();
app.use('/img', express.static(path.join(__dirname, 'img')));
app.use(cors());
app.use(express.json());

mongoose.connect('mongodb://localhost:27017/imageUploaderDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const UserSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
  images: [String], // Store image filenames associated with the user
});

const User = mongoose.model('User', UserSchema);

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dir = './img';
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + '.' + file.originalname.split('.').pop());
  },
});

const upload = multer({ storage: storage });

// Register endpoint
app.post('/register', async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      images: [], // Initialize user images as empty array
    });
    await newUser.save();
    res.json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error registering user' });
  }
});

// Login endpoint
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid password' });
    }
    res.json({ message: 'Login successful', userId: user._id });
  } catch (error) {
    res.status(500).json({ error: 'Error logging in' });
  }
});

// Upload endpoint
app.post('/upload', upload.single('file'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }
  const { userId } = req.body; // Assuming userId is sent from the authenticated user
  const user = await User.findById(userId);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  user.images.push(req.file.filename);
  await user.save();
  res.json({ status: 'ok', data: req.file });
});

// Get all images for a user endpoint
app.get('/images/:userId', async (req, res) => {
  const { userId } = req.params;
  const user = await User.findById(userId);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  res.json({ images: user.images });
});

// Delete image endpoint
app.delete('/image/:filename/:userId', async (req, res) => {
  const { filename, userId } = req.params;
  const user = await User.findById(userId);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  const index = user.images.indexOf(filename);
  if (index !== -1) {
    user.images.splice(index, 1);
    await user.save();
    const imgPath = path.join(__dirname, 'img', filename);
    fs.unlink(imgPath, (err) => {
      if (err) {
        return res.status(500).json({ error: 'Error deleting image' });
      }
      res.json({ message: 'Image deleted successfully' });
    });
  } else {
    res.status(404).json({ error: 'Image not found for the user' });
  }
});

app.listen(9000, (err) => {
  if (!err) {
    console.log('Server is running on port 9000');
  } else {
    console.error('Error starting server:', err);
  }
});
