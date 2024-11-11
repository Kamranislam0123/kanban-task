const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Enable CORS for all routes
app.use(cors());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

// Define a schema for file metadata
const fileSchema = new mongoose.Schema({
  filename: String,
  path: String,
  size: Number,
  uploadDate: { type: Date, default: Date.now }
});

const File = mongoose.model('File', fileSchema);

// Set up Multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage });

// API endpoint to upload files
app.post('/upload', upload.single('file'), async (req, res) => {
  try {
    const file = new File({
      filename: req.file.filename,
      path: req.file.path,
      size: req.file.size
    });
    await file.save();
    res.status(200).json({ filename: req.file.filename });
  } catch (err) {
    res.status(500).send('Error uploading file');
  }
});

// API endpoint to count files
app.get('/file-count', async (req, res) => {
  try {
    const count = await File.countDocuments();
    res.status(200).json({ count });
  } catch (err) {
    res.status(500).send('Error counting files');
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
