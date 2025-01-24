import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import HeatmapOverlay from 'heatmap.js/plugins/leaflet-heatmap';
import 'leaflet/dist/leaflet.css';

const Map = () => {
    const mapRef = useRef(null);
  
    // Загрузка данных с бэкенда
    const fetchData = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/heritage');

            const data = await response.json;
            return data;
        } catch (error) {
            console.error('Ошибка при загрузке данных:', error);
            return [];
        }
      };
    useEffect(() => {
        // Инициализация карты
        const map = L.map(mapRef.current).setView([55.76, 37.64], 10);

        // Добавление слоя с тайлами OpenStreetMap
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        }).addTo(map);

        // Конфигурация тепловой карты
        const heatmapLayer = new HeatmapOverlay({
            radius: 250, // Радиус точек
            maxOpacity: 0.8, // Максимальная прозрачность
            scaleRadius: true, // Масштабирование радиуса
            useLocalExtrema: false, // Использование локальных экстремумов
            latField: 'lat', // Поле для широты
            lngField: 'lng', // Поле для долготы
            valueField: 'value', // Поле для значения
        });

        const points = fetchData();

        // Установка данных
        heatmapLayer.setData({
            max: 1, // Максимальное значение
            data: points,
            });
        
            // Добавление тепловой карты на карту
            map.addLayer(heatmapLayer);

        // Очистка при размонтировании компонента
        return () => {
        map.remove();
        };
  }, []);

  return <div ref={mapRef} style={{ width: '100%', height: '600px' }} />;
};

export default Map;