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
            const data = await response.json(); // data уже является объектом
            return data; // Возвращаем данные как есть
        } catch (error) {
            console.error('Ошибка при загрузке данных:', error);
            return [];
        }
    };

    useEffect(() => {
        // Добавление слоя с тайлами OpenStreetMap
        var baseLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors',
        });

        // Конфигурация тепловой карты
        const heatmapLayer = new HeatmapOverlay({
            radius: 1, // Радиус точек
            maxOpacity: 0.8, // Максимальная прозрачность
            scaleRadius: true, // Масштабирование радиуса
            useLocalExtrema: true, // Использование локальных экстремумов
            latField: 'lat', // Поле для широты
            lngField: 'lng', // Поле для долготы
            valueField: 'value' // Поле для значения
        });

        // Инициализация карты
        const map = new L.Map(mapRef.current, {
            center: new L.LatLng(55.76, 37.64),
            zoom: 10,
            layers: [baseLayer, heatmapLayer]
        });

        // Загрузка данных и установка их в тепловую карту
        fetchData().then(points => {
            console.log(points); // Проверка данных
            heatmapLayer.setData({
                max: 1, // Максимальное значение
                data: points, // Устанавливаем данные
            });
        });

        // Очистка при размонтировании компонента
        return () => {
            map.remove();
        };
    }, []);

    return <div ref={mapRef} style={{ width: '100%', height: '600px' }} />;
};

export default Map;