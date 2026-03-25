const express = require('express');
const router = express.Router();
const db = require('../utils/jsonDB');
const auth = require('../middleware/auth.middleware');

// GET /api/users/:username
router.get('/:username', (req, res) => {
  const users = db.read('users.json');
  const user = users.find(u => u.username === req.params.username);
  if (!user) return res.status(404).json({ message: 'User not found' });
  const { passwordHash: _, ...safeUser } = user;
  res.json(safeUser);
});

// GET /api/users/me/stats
router.get('/me/stats', auth, (req, res) => {
  const users = db.read('users.json');
  const user = users.find(u => u.id === req.user.id);
  if (!user) return res.status(404).json({ message: 'User not found' });

  const problems = db.read('problems.json');
  const submissions = db.read('submissions.json').filter(s => s.userId === req.user.id);

  const solvedEasy = user.solvedProblems.filter(id => problems.find(p => p.id === id && p.difficulty === 'Easy')).length;
  const solvedMedium = user.solvedProblems.filter(id => problems.find(p => p.id === id && p.difficulty === 'Medium')).length;
  const solvedHard = user.solvedProblems.filter(id => problems.find(p => p.id === id && p.difficulty === 'Hard')).length;

  res.json({
    totalSolved: user.solvedProblems.length,
    solvedEasy,
    solvedMedium,
    solvedHard,
    xp: user.xp,
    streak: user.streak,
    recentSubmissions: submissions.slice(-5).reverse()
  });
});

// PUT /api/users/me
router.put('/me', auth, (req, res) => {
  const users = db.read('users.json');
  const idx = users.findIndex(u => u.id === req.user.id);
  if (idx === -1) return res.status(404).json({ message: 'User not found' });
  
  const { name, country } = req.body;
  if (name) users[idx].name = name;
  if (country) users[idx].country = country;
  
  db.write('users.json', users);
  const { passwordHash: _, ...safeUser } = users[idx];
  res.json(safeUser);
});

module.exports = router;
