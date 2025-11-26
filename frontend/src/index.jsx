const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const feedbackRoutes = require('./routes/feedback');
const app = express();
const PORT = process.env.PORT || 8080;

// БД и роуты
require('./db'); // инициализация

app.use(cors());
app.use(bodyParser.json());

app.use('/api', feedbackRoutes);

app.get('/', (req, res) => {
  res.send('Backend работает');
});

app.listen(PORT, () => {
  console.log(`Backend listening on port ${PORT}`);
});