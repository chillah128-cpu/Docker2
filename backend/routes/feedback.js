const express = require('express');
const router = express.Router();
const db = require('../db');
const fetch = require('node-fetch'); // если используется node-fetch v2

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

    // Отправка в Telegram после успешной записи
    const botToken = process.env.8462290537:AAENLyTdB_juV82jqWbyMh_anyLXf5ksXtM;
    const chatId = process.env.997723228;

    const sendTelegram = async () => {
      if (botToken && chatId) {
        const text = `Новая заявка обратной связи:\n\nИмя: ${name}\nEmail: ${email}\nСообщение:\n${message}`;
        const url = `https://api.telegram.org/bot${botToken}/sendMessage`;
        const payload = { chat_id: chatId, text, parse_mode: 'Markdown' };

        try {
          const r = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
          });
          const data = await r.json();
          // Можно вернуть информацию Telegram вместе с записью
          return res.json({ id: this.lastID, name, email, message, created_at: new Date().toISOString(), telegram: data });
        } catch (e) {
          // Ошибка отправки в Telegram не критична для записи
          return res.json({ id: this.lastID, name, email, message, created_at: new Date().toISOString(), telegram_error: e.message });
        }
      } else {
        // Telegram не настроен
        return res.json({ id: this.lastID, name, email, message, created_at: new Date().toISOString(), telegram: 'not configured' });
      }
    };

    // Вызываем отдельно, чтобы не задерживать ответ
    sendTelegram();
  });
  stmt.finalize();
});

module.exports = router;
