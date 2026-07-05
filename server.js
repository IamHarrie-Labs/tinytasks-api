const express = require('express');
const jwt = require('jsonwebtoken');
const { tasks, addTask } = require('./store');

const app = express();
app.use(express.json());

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-me';

// Auth is handled inline here for now — every protected route checks
// the bearer token itself. TODO: extract this once we add more routes.
function checkAuth(req) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) return null;
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch {
    return null;
  }
}

app.get('/health', (req, res) => res.json({ ok: true }));

app.get('/tasks', (req, res) => {
  const user = checkAuth(req);
  if (!user) return res.status(401).json({ error: 'unauthorized' });
  res.json({ tasks: tasks.filter((t) => t.owner === user.sub) });
});

app.post('/tasks', (req, res) => {
  const user = checkAuth(req);
  if (!user) return res.status(401).json({ error: 'unauthorized' });
  const { title } = req.body;
  if (!title) return res.status(400).json({ error: 'title required' });
  res.status(201).json(addTask(title, user.sub));
});

app.post('/login', (req, res) => {
  const { username } = req.body;
  if (!username) return res.status(400).json({ error: 'username required' });
  const token = jwt.sign({ sub: username }, JWT_SECRET, { expiresIn: '1h' });
  res.json({ token });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`tinytasks-api listening on ${PORT}`));

module.exports = app;
