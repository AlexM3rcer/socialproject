// update-coordinates.js
const { Pool } = require('pg');
const axios = require('axios');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'heritages',
  password: 'ggwp',
  port: 5432,
});

async function geocodeAddress(address) {
  // Та же функция, что и выше
}

async function updateCoordinates() {
  try {
    // Получаем все записи без координат
    const result = await pool.query(`
      SELECT id, object_name, full_address 
      FROM heritage_objects 
      WHERE jsonb_extract_path_text(map_position, 'coordinates') IS NULL 
      AND full_address IS NOT NULL
    `);
    
    console.log(`Найдено ${result.rows.length} записей без координат`);
    
    for (let i = 0; i < result.rows.length; i++) {
      const row = result.rows[i];
      
      // Добавляем задержку, чтобы не превысить лимиты API
      await new Promise(resolve => setTimeout(resolve, 10));
      
      console.log(`Обработка ${i+1}/${result.rows.length}: ${row.object_name}`);
      
      const coordinates = await geocodeAddress(row.full_address);
      
      if (coordinates) {
        await pool.query(`
          UPDATE heritage_objects 
          SET map_position = jsonb_build_object('coordinates', jsonb_build_array($1, $2)) 
          WHERE id = $3
        `, [coordinates.lng, coordinates.lat, row.id]);
        
        console.log(`Обновлены координаты для: ${row.object_name}`);
      } else {
        console.log(`Не удалось найти координаты для: ${row.object_name}`);
      }
    }
    
    console.log('Обновление координат завершено');
  } catch (error) {
    console.error('Ошибка:', error);
  } finally {
    pool.end();
  }
}

updateCoordinates();