import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import HeatmapOverlay from 'heatmap.js/plugins/leaflet-heatmap';
import 'leaflet/dist/leaflet.css';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
import 'leaflet.markercluster';

const Map = ({ onDataUpdate }) => {
    const mapRef = useRef(null);
    const [rad, setRad] = useState(0.1);
    const [opac, setOpac] = useState(0.8);
    const [mapCenter, setMapCenter] = useState([55.76, 37.64]);
    const [mapZoom, setMapZoom] = useState(10);
    
    // Состояния для фильтров
    const [objectType, setObjectType] = useState('Все типы');
    const [region, setRegion] = useState('');
    const [regionSuggestions, setRegionSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [significanceLevel, setSignificanceLevel] = useState('Любой');
    const [typology, setTypology] = useState('Все');
    
    // Состояния для карты 
    const [map, setMap] = useState(null);
    const [heatmapLayer, setHeatmapLayer] = useState(null);
    const [markersGroup, setMarkersGroup] = useState(null);
    
    // Добавляем состояние для хранения количества объектов
    const [objectsCount, setObjectsCount] = useState(0);
    
    // Состояние для хранения текущих данных
    const [currentData, setCurrentData] = useState([]);

    const fetchData = async (filters = {}) => {
        try {
            // Default method is GET if no filters are provided
            let options = {};
            
            // Если фильтры есть (т.е. они были применены), то добавляем их в запрос
            if (Object.keys(filters).length > 0) {
                options = {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(filters),
                };
            }
            
            const response = await fetch('http://localhost:5000/api/heritage', options);
            const data = await response.json();
            
            console.log('Полученные данные:', data);

            // Update the parent component with the fetched data
            if (onDataUpdate) {
                onDataUpdate(data);
            }
            
            // Сохраняем текущие данные
            setCurrentData(data);
            
            return data;
        } catch (error) {
            console.error('Ошибка при загрузке данных:', error);
            return [];
        }
    };

    // Функция для поиска регионов
    const searchRegions = async (query) => {
        try {
            const response = await fetch(`http://localhost:5000/api/regions?query=${encodeURIComponent(query)}`);
            const data = await response.json();

            console.log('Результат поиска регионов:', data);

            setRegionSuggestions(data);
            setShowSuggestions(data.length > 0);
        } catch (error) {
            console.error('Ошибка при поиске регионов:', error);
            setRegionSuggestions([]);
            setShowSuggestions(false);
        }
    };

    // Обработчик изменения поля региона
    const handleRegionChange = (e) => {
        const value = e.target.value;
        setRegion(value);
        
        if (value.length > 0) {
            searchRegions(value);
        } else {
            setRegionSuggestions([]);
            setShowSuggestions(false);
        }
    };

    // Обработчик выбора региона из списка
    const handleSelectRegion = (selectedRegion) => {
        setRegion(selectedRegion);
        setShowSuggestions(false);
    };

    const applyFilters = async () => {
        // Create filters object with only non-empty values
        const filters = {};
        
        if (objectType !== 'Все типы') {
            filters.type = objectType;
        }
        
        if (region.trim()) {
            filters.region = region.trim();
        }
        
        if (significanceLevel !== 'Любой') {
            filters.significanceLevel = significanceLevel;
        }
        
        if (typology !== 'Все') {
            filters.typology = typology;
        }
        
        
        if (map && heatmapLayer && markersGroup) {
            // Fetch data with filters
            const points = await fetchData(filters);
            
            // Обновляем количество найденных объектов
            setObjectsCount(points.length);
            
            updateMapLayers(points);
        }
    };

    // Функция для обновления слоев карты
    const updateMapLayers = (points) => {
        if (!heatmapLayer || !markersGroup) return;
        
        // Обновляем данные на карте
        heatmapLayer.setData({
            max: 1,
            data: points,
        });
        
        // Чистим предыдущие маркеры
        markersGroup.clearLayers();
        
        // Добавляем новые маркеры
        points.forEach(point => {
            const marker = L.marker([point.lat, point.lng], {icon: customIcon});
            marker.bindPopup(`<b>${point.name}</b><br>${point.address}`);
            markersGroup.addLayer(marker);
        });
    };

    const customIcon = new L.Icon({
        iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
        shadowSize: [41, 41]
    });

    // Инициализация карты (только один раз)
    useEffect(() => {
        var baseLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors',
        });

        var heatmapLayerInstance = new HeatmapOverlay({
            radius: rad,
            maxOpacity: opac,
            scaleRadius: true,
            useLocalExtrema: true,
            latField: 'lat',
            lngField: 'lng',
            valueField: 'value'
        });
        
        setHeatmapLayer(heatmapLayerInstance);

        const mapInstance = new L.Map(mapRef.current, {
            center: mapCenter,
            zoom: mapZoom,
            layers: [baseLayer, heatmapLayerInstance]
        });
        
        setMap(mapInstance);

        const southWest = L.latLng(-90, -180);
        const northEast = L.latLng(90, 180);
        const bounds = L.latLngBounds(southWest, northEast);
        mapInstance.setMaxBounds(bounds);

        mapInstance.on('moveend', () => {
            setMapCenter(mapInstance.getCenter());
        });

        mapInstance.on('zoomend', () => {
            setMapZoom(mapInstance.getZoom());
        });

        // Создаем группу кластеризации
        const markers = L.markerClusterGroup();
        setMarkersGroup(markers);
        mapInstance.addLayer(markers);

        // Инициализируем загрузку данных
        fetchData().then(points => {
            // Обновляем количество найденных объектов при первой загрузке
            setObjectsCount(points.length);
            
            heatmapLayerInstance.setData({
                max: 1,
                data: points,
            });

            points.forEach(point => {
                const marker = L.marker([point.lat, point.lng], {icon: customIcon});

                marker.bindPopup(`<b>${point.name}</b><br>${point.address}`);
                markers.addLayer(marker);
            });
        });

        return () => {
            mapInstance.remove();
        };
    }, []); // Пустой массив зависимостей - инициализация только один раз

    // Отдельный эффект для обновления настроек тепловой карты
    useEffect(() => {
        if (heatmapLayer) {
            // Обновляем настройки тепловой карты
            heatmapLayer.cfg.radius = rad;
            heatmapLayer.cfg.maxOpacity = opac;
            
            // Перерисовываем тепловую карту с текущими данными
            if (currentData.length > 0) {
                heatmapLayer.setData({
                    max: 1,
                    data: currentData,
                });
            }
        }
    }, [rad, opac, heatmapLayer]);

    // Закрыть выпадающий список при клике вне его
    useEffect(() => {
        const handleClickOutside = () => {
            setShowSuggestions(false);
        };

        document.addEventListener('click', handleClickOutside);
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, []);

    return (
        <div className="row">
            {/* Левая колонка с картой и настройками тепловой карты */}
            <div className="col-md-8">
                {/* Настройки тепловой карты */}
                <div className="card mb-3">
                    <div className="card-header bg-light">
                        <h5 className="mb-0">Настройки тепловой карты</h5>
                    </div>
                    <div className="card-body">
                        <div className="row">
                            <div className="col-md-6 mb-3">
                                <label className="form-label">Масштаб теплового слоя:</label>
                                <input 
                                    type="number" 
                                    className="form-control" 
                                    step="0.1" 
                                    value={rad} 
                                    onChange={(e) => setRad(parseFloat(e.target.value))} 
                                    required 
                                />
                            </div>
                            <div className="col-md-6 mb-3">
                                <label className="form-label">Прозрачность:</label>
                                <input 
                                    type="number" 
                                    className="form-control" 
                                    step="0.1" 
                                    value={opac} 
                                    onChange={(e) => setOpac(parseFloat(e.target.value))} 
                                    required 
                                />
                            </div>
                        </div>
                    </div>
                </div>
                
                {/* Карта */}
                <div 
                    ref={mapRef} 
                    className="border rounded shadow-sm" 
                    style={{ width: '100%', height: '600px' }} 
                />
            </div>
            
            {/* Правая колонка с фильтрами */}
            <div className="col-md-4">
                <div className="card h-100">
                    <div className="card-header bg-light">
                        <h5 className="mb-0">Фильтры</h5>
                    </div>
                    
                    <div className="card-body">
                        <div className="form-group">
                            <label className="form-label mb-2">Выберите тип объекта:</label>
                            <select 
                                className="form-select mb-3"
                                value={objectType}
                                onChange={(e) => setObjectType(e.target.value)}
                            >
                                <option>Все типы</option>
                                <option>Ансамбль</option>
                                <option>Памятник</option>
                                <option>Достопримечательное место</option>
                            </select>
                            
                            <label className="form-label mb-2">Регион:</label>
                            <div className="position-relative">
                                <input 
                                    type="text" 
                                    className="form-control mb-3" 
                                    placeholder="Введите название региона" 
                                    value={region}
                                    onChange={handleRegionChange}
                                    onClick={(e) => e.stopPropagation()}
                                />
                                {showSuggestions && (
                                    <div 
                                        className="position-absolute w-100 bg-white border rounded shadow-sm" 
                                        style={{ zIndex: 1000, maxHeight: '200px', overflowY: 'auto' }}
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        {regionSuggestions.map((suggestion, index) => (
                                            <div 
                                                key={index} 
                                                className="p-2 border-bottom cursor-pointer" 
                                                style={{ cursor: 'pointer' }}
                                                onClick={() => handleSelectRegion(suggestion)}
                                            >
                                                {suggestion}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <label className="form-label mb-2">Уровень значения:</label>
                            <select 
                                className="form-select mb-3"
                                value={significanceLevel}
                                onChange={(e) => setSignificanceLevel(e.target.value)}
                            >
                                <option>Любой</option>
                                <option>Федерального значения</option>
                                <option>Регионального значения</option>
                                <option>Местного (муниципального) значения</option>
                            </select>

                            <label className="form-label mb-2">Типология:</label>
                            <select 
                                className="form-select mb-3"
                                value={typology}
                                onChange={(e) => setTypology(e.target.value)}
                            >
                                <option>Все</option>
                                <option>Памятник градостроительства и архитектуры</option>
                                <option>Памятник истории</option>
                                <option>Памятник монументального искусства</option>
                                <option>Памятник религии</option>
                            </select>
                            
                            <button 
                                className="btn btn-primary w-100 mb-3"
                                onClick={applyFilters}
                                type="button"
                            >
                                Применить фильтры
                            </button>
                            
                            {/* Добавляем информацию о количестве найденных объектов */}
                            <div className="alert alert-info text-center">
                                Найдено {objectsCount} объектов
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Map;