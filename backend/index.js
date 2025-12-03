const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const feedbackRoutes = require('./routes/feedback');

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(bodyParser.json());

// Инициализация БД
require('./db');

app.use('/api', feedbackRoutes);

app.get('/', (req, res) => {
  res.send('Backend работает');
});

// Добавьте тестовый маршрут
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date() });
});

// Тестовый маршрут для проверки API
app.get('/api/test', (req, res) => {
  res.json({ message: 'API работает', timestamp: new Date() });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Backend listening on port ${PORT}`);
});
