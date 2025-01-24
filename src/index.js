import React from 'react';
import ReactDOM from 'react-dom';
import App from './frontend/App';
import './index.css';
import 'leaflet/dist/leaflet.css';

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);