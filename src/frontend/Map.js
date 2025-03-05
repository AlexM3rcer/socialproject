import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import HeatmapOverlay from 'heatmap.js/plugins/leaflet-heatmap';
import 'leaflet/dist/leaflet.css';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
import MarkerClusterGroup from 'leaflet.markercluster';

const Map = () => {
    const mapRef = useRef(null);
    const [rad, setRad] = useState(0.1); // Начальное значение радиуса
    const [opac, setOpac] = useState(0.8); // Начальное значение прозрачности
    const [mapCenter, setMapCenter] = useState([55.76, 37.64]); // Центр карты
    const [mapZoom, setMapZoom] = useState(10); // Уровень масштабирования

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
        var heatmapLayer = new HeatmapOverlay({
            radius: rad, // Используем значение из состояния
            maxOpacity: opac, // Используем значение из состояния
            scaleRadius: true, // Масштабирование радиуса
            useLocalExtrema: true, // Использование локальных экстремумов
            latField: 'lat', // Поле для широты
            lngField: 'lng', // Поле для долготы
            valueField: 'value' // Поле для значения
        });

        // Инициализация карты
        const map = new L.Map(mapRef.current, {
            center: mapCenter, 
            zoom: mapZoom,     
            layers: [baseLayer, heatmapLayer]
        });

        // Установка ограничений на границы карты
        const southWest = L.latLng(-90, -180); 
        const northEast = L.latLng(90, 180); 
        const bounds = L.latLngBounds(southWest, northEast);
        map.setMaxBounds(bounds);

        // Сохранение текущего центра и уровня масштабирования
        map.on('moveend', () => {
            setMapCenter(map.getCenter());
        });

        map.on('zoomend', () => {
            setMapZoom(map.getZoom());
        });

        // Загрузка данных и установка их в тепловую карту
        fetchData().then(points => {
            heatmapLayer.setData({
                max: 1, // Максимальное значение
                data: points, // Устанавливаем данные
            });
        });

        // Очистка при размонтировании компонента
        return () => {
            map.remove();
        };
    }, [rad, opac]); // Зависимости: rad и opac

    return (
        <div className="placeholder">
            <form id='mapSettings'>
                <div>
                    <label className='mapLabel'>Размер свечения:</label>
                    <input className='mapInput' type="number" value={rad} onChange={(e) => setRad(parseFloat(e.target.value))} required />
                </div>
                <div>
                    <label className='mapLabel'>Прозрачность:</label>
                    <input className='mapInput' type="number" step="0.1" value={opac} onChange={(e) => setOpac(parseFloat(e.target.value))} required />
                </div>
            </form>
            <div ref={mapRef} style={{ width: '100%', height: '600px' }} />
        </div>
    );
};

export default Map;