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
app.use(express.json());

// Маршрут для получения данных без фильтров
app.get('/api/heritage', async (req, res) => {
  try {
    // Выполняем запрос к базе данных
    const result = await pool.query("SELECT (jsonb_extract_path(map_position, 'coordinates')->>1)::FLOAT AS lat, (jsonb_extract_path(map_position, 'coordinates')->>0)::FLOAT AS lng,ROUND(CAST(calculate_value(category_type_id::INT,object_type_id::INT,unesco_id::INT,valued_id::INT,wow_id::INT) AS NUMERIC), 2) AS value, object_name AS name, full_address AS address FROM heritage_objects WHERE jsonb_extract_path_text(map_position, 'coordinates') IS NOT NULL;");

    // Отправляем данные клиенту
    res.json(result.rows);
  } catch (err) {
    console.error('Ошибка при выполнении запроса:', err);
    
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

// Маршрут для обработки фильтров
app.post('/api/heritage', async (req, res) => {
  try {
    const { type, region, significanceLevel, typology } = req.body;
    
    // Начинаем строить SQL запрос
    let query = `
      SELECT 
        (jsonb_extract_path(map_position, 'coordinates')->>1)::FLOAT AS lat, 
        (jsonb_extract_path(map_position, 'coordinates')->>0)::FLOAT AS lng,
        ROUND(CAST(calculate_value(category_type_id::INT,object_type_id::INT,unesco_id::INT,valued_id::INT,wow_id::INT) AS NUMERIC), 2) AS value, 
        object_name AS name, 
        full_address AS address,
        object_type_value,
        region_value,
        category_type_value,
        typologies->0->>'value'
      FROM heritage_objects 
      WHERE jsonb_extract_path_text(map_position, 'coordinates') IS NOT NULL
    `;
    
    const queryParams = [];
    
    // Добавляем условия фильтрации, если они предоставлены
    if (type) {
      queryParams.push(type);
      query += ` AND object_type_value = $${queryParams.length}`;
    }
    
    if (region) {
      queryParams.push(`%${region}%`);
      query += ` AND region_value ILIKE $${queryParams.length}`;
    }
    
    if (significanceLevel) {
      queryParams.push(significanceLevel);
      query += ` AND category_type_value = $${queryParams.length}`;
    }
    
    if (typology) {
      queryParams.push(typology);
      query += ` AND typologies->0->>'value' = $${queryParams.length}`;
    }
    
    // Выполняем запрос с параметрами
    const result = await pool.query(query, queryParams);
    
    // Отправляем отфильтрованные данные клиенту
    res.json(result.rows);
  } catch (err) {
    console.error('Ошибка при выполнении запроса с фильтрами:', err);

    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

app.listen(5000, () => {
  console.log('Сервер запущен на http://localhost:5000');
});