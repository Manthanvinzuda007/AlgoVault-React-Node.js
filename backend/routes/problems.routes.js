const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const db = require('../utils/jsonDB');
const auth = require('../middleware/auth.middleware');

// GET /api/problems
router.get('/', (req, res) => {
  const { search, difficulty, topic, sort, page = 1, limit = 20 } = req.query;
  let problems = db.read('problems.json');

  if (search) {
    const q = search.toLowerCase();
    problems = problems.filter(p =>
      p.title.toLowerCase().includes(q) || p.topics.some(t => t.toLowerCase().includes(q))
    );
  }
  if (difficulty && difficulty !== 'All') {
    problems = problems.filter(p => p.difficulty === difficulty);
  }
  if (topic && topic !== 'All') {
    problems = problems.filter(p => p.topics.includes(topic));
  }

  if (sort === 'acceptance') {
    problems.sort((a, b) => b.acceptanceRate - a.acceptanceRate);
  } else if (sort === 'difficulty-asc') {
    const order = { Easy: 1, Medium: 2, Hard: 3 };
    problems.sort((a, b) => order[a.difficulty] - order[b.difficulty]);
  } else if (sort === 'difficulty-desc') {
    const order = { Easy: 1, Medium: 2, Hard: 3 };
    problems.sort((a, b) => order[b.difficulty] - order[a.difficulty]);
  }

  const total = problems.length;
  const start = (page - 1) * limit;
  const paginated = problems.slice(start, start + parseInt(limit));

  // Strip testCases from list view
  const safe = paginated.map(({ testCases, starterCode, ...p }) => p);

  res.json({ problems: safe, total, page: parseInt(page), pages: Math.ceil(total / limit) });
});

// GET /api/problems/:id
router.get('/:id', (req, res) => {
  const problems = db.read('problems.json');
  const problem = problems.find(p => p.id === req.params.id || p.slug === req.params.id || p.number === parseInt(req.params.id));
  if (!problem) return res.status(404).json({ message: 'Problem not found' });
  res.json(problem);
});

// POST /api/problems (admin only)
router.post('/', auth, (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ message: 'Admin only' });
  const problems = db.read('problems.json');
  const newProblem = { id: uuidv4(), number: problems.length + 1, createdAt: new Date().toISOString(), ...req.body };
  problems.push(newProblem);
  db.write('problems.json', problems);
  res.status(201).json(newProblem);
});

module.exports = router;
