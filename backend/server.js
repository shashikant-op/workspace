require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');
const fileRoutes = require('./routes/files');
const path = require('path');
const app = express();




// Middleware
app.use(cors({
  origin: 'https://workspace-one-theta.vercel.app', 
  credentials: true
}));
app.use(express.json()); 
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const ADMIN_EMAIL = process.env.AUTH_ADMIN_EMAIL;
const ADMIN_PASSWORD = process.env.AUTH_ADMIN_PASSWORD;

app.post('/admin/login', (req, res) => {
  const { email, password } = req.body;

  if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
    return res.json({ success: true, message: 'Login successful' });
  } else {
    return res.status(502).json({ success: false, message: 'check password and email' });
  }
}); 


// Database connection
connectDB();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/files', fileRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
