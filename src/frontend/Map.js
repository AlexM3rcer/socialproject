import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import HeatmapOverlay from 'heatmap.js/plugins/leaflet-heatmap';
import 'leaflet/dist/leaflet.css';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
import 'leaflet.markercluster';

const Map = () => {
    const mapRef = useRef(null);
    const [rad, setRad] = useState(0.1);
    const [opac, setOpac] = useState(0.8);
    const [mapCenter, setMapCenter] = useState([55.76, 37.64]);
    const [mapZoom, setMapZoom] = useState(10);
    const [isOpen, setIsOpen] = useState(false);

    const fetchData = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/heritage');
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Ошибка при загрузке данных:', error);
            return [];
        }
    };

    const customIcon = new L.Icon({
        iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
        shadowSize: [41, 41]
    });


    useEffect(() => {
        var baseLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors',
        });

        var heatmapLayer = new HeatmapOverlay({
            radius: rad,
            maxOpacity: opac,
            scaleRadius: true,
            useLocalExtrema: true,
            latField: 'lat',
            lngField: 'lng',
            valueField: 'value'
        });

        const map = new L.Map(mapRef.current, {
            center: mapCenter,
            zoom: mapZoom,
            layers: [baseLayer, heatmapLayer]
        });

        const southWest = L.latLng(-90, -180);
        const northEast = L.latLng(90, 180);
        const bounds = L.latLngBounds(southWest, northEast);
        map.setMaxBounds(bounds);

        map.on('moveend', () => {
            setMapCenter(map.getCenter());
        });

        map.on('zoomend', () => {
            setMapZoom(map.getZoom());
        });

        // Создаем группу кластеризации
        const markers = L.markerClusterGroup();

        fetchData().then(points => {
            heatmapLayer.setData({
                max: 1,
                data: points,
            });

            points.forEach(point => {
                const marker = L.marker([point.lat, point.lng], {icon: customIcon});
                marker.bindPopup(`<b>${point.name}</b><br>${point.address}`);
                markers.addLayer(marker);
            });

            map.addLayer(markers);
        });

        return () => {
            map.remove();
        };
    }, [rad, opac]);

    return (
        <div className="placeholder">
            <form id='mapSettings'>
                <div>
                    <div id='mapFilters' onClick={() => setIsOpen(!isOpen)}>
                        <p>Раскрыть фильтры</p>
                    </div>
                    {isOpen && (
                        <select>
                            <option>Превед</option>
                        </select>
                    )}
                </div>
                <div id='heatLayerSettings'>
                    <div className='mapSettingsCell'>
                        <label className='mapLabel'>Масштаб теплового слоя:</label>
                        <input className='mapInput' type="number" step="0.1" value={rad} onChange={(e) => setRad(parseFloat(e.target.value))} required />
                    </div>
                    <div className='mapSettingsCell'>
                        <label className='mapLabel'>Прозрачность:</label>
                        <input className='mapInput' type="number" step="0.1" value={opac} onChange={(e) => setOpac(parseFloat(e.target.value))} required />
                    </div>
                </div>
            </form>
            <div ref={mapRef} style={{ width: '50%', height: '600px' }} />
        </div>
    );
};

export default Map;