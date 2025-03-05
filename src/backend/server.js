const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'heritages',
  password: 'ggwp',
  port: 5432,
});

app.use(cors());


// Маршрут для получения данных
app.get('/api/heritage', async (req, res) => {
  try {
    // Выполняем запрос к базе данных
    const result = await pool.query("SELECT (jsonb_extract_path(map_position, 'coordinates')->>1)::FLOAT AS lat, (jsonb_extract_path(map_position, 'coordinates')->>0)::FLOAT AS lng,ROUND(CAST(calculate_value(category_type_id::INT,object_type_id::INT,unesco_id::INT,valued_id::INT,wow_id::INT) AS NUMERIC), 2) AS value FROM heritage_objects WHERE jsonb_extract_path_text(map_position, 'coordinates') IS NOT NULL;");

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