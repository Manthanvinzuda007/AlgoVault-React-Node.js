const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const db = require('../utils/jsonDB');
const auth = require('../middleware/auth.middleware');

// GET /api/discussions
router.get('/', (req, res) => {
  const { sort = 'new', tag } = req.query;
  let discussions = db.read('discussions.json');
  if (tag) discussions = discussions.filter(d => d.tags.includes(tag));
  if (sort === 'hot') discussions.sort((a, b) => (b.votes + b.comments.length * 2) - (a.votes + a.comments.length * 2));
  else if (sort === 'top') discussions.sort((a, b) => b.votes - a.votes);
  else discussions.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  res.json(discussions);
});

// GET /api/discussions/:id
router.get('/:id', (req, res) => {
  const discussions = db.read('discussions.json');
  const d = discussions.find(d => d.id === req.params.id);
  if (!d) return res.status(404).json({ message: 'Not found' });
  res.json(d);
});

// POST /api/discussions
router.post('/', auth, (req, res) => {
  const { title, body, tags } = req.body;
  if (!title || !body) return res.status(400).json({ message: 'Title and body required' });
  
  const users = db.read('users.json');
  const user = users.find(u => u.id === req.user.id);
  
  const discussions = db.read('discussions.json');
  const newD = {
    id: uuidv4(),
    title, body,
    authorId: req.user.id,
    authorName: user?.name || 'Anonymous',
    authorUsername: user?.username || 'anon',
    tags: tags || [],
    votes: 0,
    comments: [],
    createdAt: new Date().toISOString()
  };
  discussions.unshift(newD);
  db.write('discussions.json', discussions);
  res.status(201).json(newD);
});

// POST /api/discussions/:id/comments
router.post('/:id/comments', auth, (req, res) => {
  const { body } = req.body;
  if (!body) return res.status(400).json({ message: 'Comment body required' });
  
  const users = db.read('users.json');
  const user = users.find(u => u.id === req.user.id);
  
  const discussions = db.read('discussions.json');
  const idx = discussions.findIndex(d => d.id === req.params.id);
  if (idx === -1) return res.status(404).json({ message: 'Discussion not found' });
  
  const comment = {
    id: uuidv4(),
    authorId: req.user.id,
    authorName: user?.name || 'Anonymous',
    authorUsername: user?.username || 'anon',
    body, votes: 0,
    createdAt: new Date().toISOString()
  };
  discussions[idx].comments.push(comment);
  db.write('discussions.json', discussions);
  res.status(201).json(comment);
});

// PUT /api/discussions/:id/vote
router.put('/:id/vote', auth, (req, res) => {
  const { direction } = req.body; // 'up' or 'down'
  const discussions = db.read('discussions.json');
  const d = discussions.find(d => d.id === req.params.id);
  if (!d) return res.status(404).json({ message: 'Not found' });
  d.votes += direction === 'up' ? 1 : -1;
  db.write('discussions.json', discussions);
  res.json({ votes: d.votes });
});

module.exports = router;
