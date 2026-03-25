// Created By Manthan Vinzuda 
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const app = express();

app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(express.json());
app.use(morgan('dev'));

// Routes
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/problems', require('./routes/problems.routes'));
app.use('/api/submissions', require('./routes/submissions.routes'));
app.use('/api/users', require('./routes/users.routes'));
app.use('/api/discussions', require('./routes/discussions.routes'));
app.use('/api/leaderboard', require('./routes/leaderboard.routes'));

// Health check
app.get('/api/health', (req, res) => res.json({ status: 'OK', message: 'AlgoVault API running' }));

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal server error' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`\n🏛️  AlgoVault server running on http://localhost:${PORT}\n`));
