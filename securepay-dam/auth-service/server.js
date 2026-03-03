const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET || 'change_this_secret';

// En memoria - solo skeleton
const users = [];

app.get('/health', (req, res) => res.json({ ok: true }));

app.post('/register', async (req, res) => {
  const { username, password, role } = req.body;
  if (!username || !password) return res.status(400).json({ error: 'missing fields' });
  if (users.find(u => u.username === username)) return res.status(409).json({ error: 'user exists' });
  const hash = await bcrypt.hash(password, 10);
  const user = { id: users.length+1, username, password_hash: hash, role: role || 'user' };
  users.push(user);
  res.status(201).json({ id: user.id, username: user.username });
});

app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = users.find(u => u.username === username);
  if (!user) return res.status(401).json({ error: 'invalid credentials' });
  const ok = await bcrypt.compare(password, user.password_hash);
  if (!ok) return res.status(401).json({ error: 'invalid credentials' });
  const token = jwt.sign({ sub: user.id, role: user.role }, JWT_SECRET, { expiresIn: '1h' });
  res.json({ token });
});

app.listen(PORT, () => console.log(`Auth service listening on ${PORT}`));
