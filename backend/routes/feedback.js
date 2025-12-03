const express = require('express');
const router = express.Router();
const path = require('path');
const sqlite3 = require('sqlite3').verbose();

// Создаем путь к БД
const dbPath = path.join(__dirname, '..', 'feedback.db');
const db = new sqlite3.Database(dbPath);

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
  stmt.run([name, email, message], async function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    // Формируем текст для Telegram
    const botToken = process.env.8462290537:AAENLyTdB_juV82jqWbyMh_anyLXf5ksXtM;
    const chatId = process.env.997723228;
    const text = `Новая заявка обратной связи:\n\nИмя: ${name || '—'}\nEmail: ${email || '—'}\nСообщение:\n${message || '—'}`;

    if (botToken && chatId && text.trim()) {
      const url = `https://api.telegram.org/bot${botToken}/sendMessage`;
      const payload = { chat_id: chatId, text, parse_mode: 'Markdown' };

      try {
        const r = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        const data = await r.json();
        if (!r.ok || data?.ok === false) {
          // Не ломаем ответ клиенту, просто пометим Telegram-ошибку
          return res.json({ id: this.lastID, name, email, message, created_at: new Date().toISOString(), telegram: { ok: false, description: data?.description } });
        }
        return res.json({ id: this.lastID, name, email, message, created_at: new Date().toISOString(), telegram: data });
      } catch (e) {
        return res.json({ id: this.lastID, name, email, message, created_at: new Date().toISOString(), telegram_error: e.message });
      }
    }

    // Если Telegram не настроен, просто вернем базовую запись
    res.json({ id: this.lastID, name, email, message, created_at: new Date().toISOString(), telegram: 'not configured' });
  });
  stmt.finalize();
});

module.exports = router;
