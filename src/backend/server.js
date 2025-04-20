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
        typologies->0->>'value' AS typology,
        (jsonb_extract_path(photo, 'url')) AS photo_url,
        create_date,
        security_info
      FROM heritage_objects 
      WHERE jsonb_extract_path_text(map_position, 'coordinates') IS NOT NULL
    `;
    // Выполняем запрос к базе данных
    const result = await pool.query(query);

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
        typologies->0->>'value' AS typology,
        (jsonb_extract_path(photo, 'url')) AS photo_url,
        create_date,
        security_info
      FROM heritage_objects 
      WHERE jsonb_extract_path_text(map_position, 'coordinates') IS NOT NULL
    `;
    
    const queryParams = [];
    let paramCounter = 1;
    
    // Добавляем условия фильтрации, если они предоставлены
    if (type) {
      queryParams.push(type);
      query += ` AND object_type_value = $${paramCounter++}`;
    }
    
    if (region) {
      queryParams.push(`%${region}%`);
      query += ` AND region_value ILIKE $${paramCounter++}`;
    }
    
    if (significanceLevel) {
      queryParams.push(significanceLevel);
      query += ` AND category_type_value = $${paramCounter++}`;
    }
    
    if (typology) {
      queryParams.push(typology);
      query += ` AND typologies->0->>'value' = $${paramCounter++}`;
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

// Получение регионов для живого поиска
app.get('/api/regions', async (req, res) => {
  try {
    const { query } = req.query;
    let sqlQuery = "SELECT DISTINCT region_value FROM heritage_objects WHERE region_value IS NOT NULL";
    
    if (query) {
      sqlQuery += " AND region_value ILIKE $1";
    }
    
    sqlQuery += " ORDER BY region_value LIMIT 10";
    
    const result = await pool.query(
      sqlQuery,
      query ? [`%${query}%`] : []
    );
    
    res.json(result.rows.map(row => row.region_value));
  } catch (err) {
    console.error('Ошибка при поиске регионов:', err);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

app.listen(5000, () => {
  console.log('Сервер запущен на http://localhost:5000');
});