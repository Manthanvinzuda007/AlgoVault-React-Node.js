const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const db = require('../utils/jsonDB');
const auth = require('../middleware/auth.middleware');

const SECRET = process.env.JWT_SECRET || 'algvault_secret_key';

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { name, username, email, password } = req.body;
    if (!name || !username || !email || !password)
      return res.status(400).json({ message: 'All fields required' });

    const users = db.read('users.json');
    if (users.find(u => u.email === email))
      return res.status(409).json({ message: 'Email already in use' });
    if (users.find(u => u.username === username))
      return res.status(409).json({ message: 'Username already taken' });

    const passwordHash = await bcrypt.hash(password, 10);
    const newUser = {
      id: uuidv4(),
      name, username, email, passwordHash,
      role: 'user', xp: 0, streak: 0,
      solvedProblems: [],
      joinedAt: new Date().toISOString(),
      lastActive: new Date().toISOString(),
      country: 'IN'
    };
    users.push(newUser);
    db.write('users.json', users);

    const token = jwt.sign({ id: newUser.id, username: newUser.username, role: newUser.role }, SECRET, { expiresIn: '7d' });
    const { passwordHash: _, ...safeUser } = newUser;
    res.status(201).json({ token, user: safeUser });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ message: 'Email and password required' });

    const users = db.read('users.json');
    const user = users.find(u => u.email === email || u.username === email);
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match) return res.status(401).json({ message: 'Invalid credentials' });

    user.lastActive = new Date().toISOString();
    db.write('users.json', users);

    const token = jwt.sign({ id: user.id, username: user.username, role: user.role }, SECRET, { expiresIn: '7d' });
    const { passwordHash: _, ...safeUser } = user;
    res.json({ token, user: safeUser });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// GET /api/auth/me
router.get('/me', auth, (req, res) => {
  const users = db.read('users.json');
  const user = users.find(u => u.id === req.user.id);
  if (!user) return res.status(404).json({ message: 'User not found' });
  const { passwordHash: _, ...safeUser } = user;
  res.json(safeUser);
});

// Check username availability
router.get('/check-username/:username', (req, res) => {
  const users = db.read('users.json');
  const exists = users.some(u => u.username === req.params.username);
  res.json({ available: !exists });
});

module.exports = router;
