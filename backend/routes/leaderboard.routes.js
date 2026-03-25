const express = require('express');
const router = express.Router();
const db = require('../utils/jsonDB');

// GET /api/leaderboard
router.get('/', (req, res) => {
  const users = db.read('users.json');
  const leaderboard = users
    .map(u => ({
      id: u.id,
      name: u.name,
      username: u.username,
      xp: u.xp || 0,
      streak: u.streak || 0,
      solvedCount: (u.solvedProblems || []).length,
      country: u.country || 'IN',
      joinedAt: u.joinedAt
    }))
    .sort((a, b) => b.xp - a.xp)
    .map((u, idx) => ({ ...u, rank: idx + 1 }));
  
  res.json(leaderboard);
});

// GET /api/leaderboard/weekly
router.get('/weekly', (req, res) => {
  const users = db.read('users.json');
  // Simulate weekly: use streak as a weekly proxy
  const leaderboard = users
    .map(u => ({
      id: u.id,
      name: u.name,
      username: u.username,
      xp: Math.floor((u.xp || 0) * 0.3 + (u.streak || 0) * 20),
      streak: u.streak || 0,
      solvedCount: (u.solvedProblems || []).length,
      country: u.country || 'IN'
    }))
    .sort((a, b) => b.xp - a.xp)
    .map((u, idx) => ({ ...u, rank: idx + 1 }));
  
  res.json(leaderboard);
});

module.exports = router;
