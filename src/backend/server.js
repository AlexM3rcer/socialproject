const express = require('express');
const { Pool } = require('pg');

const app = express();
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'heritage_objects',
  password: 'ggwp',
  port: 5432,
});

// Маршрут для получения данных
app.get('/api/heritage', async (req, res) => {
  try {
    // Выполняем запрос к базе данных
    const result = await pool.query('SELECT * FROM cultural_heritage WHERE id = 1;;');

    // Отправляем данные клиенту
    res.json(result.rows);
  } catch (err) {
    console.error('Ошибка при выполнении запроса:', err);
    res.status(500).send('Ошибка сервера');
  }
});

app.listen(5000, () => {
  console.log('Сервер запущен на http://localhost:5000');
});