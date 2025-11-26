const express = require('express');
const router = express.Router();
const db = require('../db');

// Получение всех записей (для тестирования)
router.get('/feedback', (req, res) => {
  db.all('SELECT * FROM feedback ORDER BY created_at DESC', [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

// Отправка формы обратной связи
router.post('/feedback', (req, res) => {
  const { name, email, message } = req.body;
  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Missing fields' });
  }

  const stmt = db.prepare('INSERT INTO feedback (name, email, message) VALUES (?, ?, ?)');
  stmt.run([name, email, message], function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ id: this.lastID, name, email, message, created_at: new Date().toISOString() });
  });
  stmt.finalize();
});

module.exports = router;