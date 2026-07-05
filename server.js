const express = require('express');
const { tasks, addTask } = require('./store');
const { requireAuth, signToken } = require('./middleware/auth');

const app = express();
app.use(express.json());

app.get('/health', (req, res) => res.json({ ok: true }));

app.get('/tasks', requireAuth, (req, res) => {
  res.json({ tasks: tasks.filter((t) => t.owner === req.user.sub) });
});

app.post('/tasks', requireAuth, (req, res) => {
  const { title } = req.body;
  if (!title) return res.status(400).json({ error: 'title required' });
  res.status(201).json(addTask(title, req.user.sub));
});

app.delete('/tasks/:id', requireAuth, (req, res) => {
  const idx = tasks.findIndex((t) => t.id === Number(req.params.id) && t.owner === req.user.sub);
  if (idx === -1) return res.status(404).json({ error: 'not found' });
  tasks.splice(idx, 1);
  res.status(204).end();
});

app.post('/login', (req, res) => {
  const { username } = req.body;
  if (!username) return res.status(400).json({ error: 'username required' });
  res.json({ token: signToken({ sub: username }) });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`tinytasks-api listening on ${PORT}`));

module.exports = app;
