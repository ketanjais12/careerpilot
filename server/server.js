const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const applicationRoutes = require('./routes/applicationRoutes');

dotenv.config();

connectDB();

const app = express();

app.use(express.json());
app.use(cookieParser()); 


app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true, 
}));

app.use('/api/auth', authRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/resume', require('./routes/resumeRoutes'));
app.use('/api/ai', require('./routes/aiRoutes'));
app.use('/api', require('./routes/interviewRoutes'));

app.get('/api/health', (req, res) => {
  res.status(200).json({ success: true, message: 'CareerPilot API is running!' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});