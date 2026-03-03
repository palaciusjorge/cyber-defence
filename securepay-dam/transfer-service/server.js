const express = require('express');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const app = express();
app.use(helmet());
app.use(express.json());
app.use(rateLimit({ windowMs: 60*1000, max: 60 }));

const PORT = process.env.PORT || 3002;

app.get('/health', (req, res) => res.json({ ok: true }));

// Endpoint de ejemplo para transferencias con validaciones básicas
app.post('/transfer', (req, res) => {
  const { from_account, to_account, amount } = req.body;
  if (!from_account || !to_account || !amount) return res.status(400).json({ error: 'missing fields' });
  if (typeof amount !== 'number' || amount <= 0) return res.status(400).json({ error: 'invalid amount' });
  // Nota: aquí integrar validaciones CIA, control de privilegios y prevención SQLi en la DB layer
  res.status(201).json({ status: 'accepted', transfer: { from_account, to_account, amount } });
});

app.listen(PORT, () => console.log(`Transfer service listening on ${PORT}`));
