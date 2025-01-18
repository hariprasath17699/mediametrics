const express = require('express');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const dotenv = require('dotenv');
const authRoutes = require('./routes/auth_routes');
const authenticate = require('./config/middleware/authonticate');

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(helmet());

// Routes
app.use('/auth', authRoutes);

// Protected example route
app.get('/profile', authenticate, (req, res) => {
  res.status(200).json({ message: 'Profile accessed successfully', user: req.user });
});

// Start server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});