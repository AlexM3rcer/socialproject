import React, { useState } from 'react';

const Instructions = () => {
  const [isExpanded, setIsExpanded] = useState(true);

  const toggleInstructions = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="card shadow-sm mb-4">
      <div 
        className="card-header bg-light d-flex justify-content-between align-items-center" 
        onClick={toggleInstructions}
        style={{ cursor: 'pointer' }}
      >
        <h2 className="h4 mb-0">Инструкция по использованию</h2>
        <button 
          className="btn btn-sm btn-outline-secondary" 
          aria-expanded={isExpanded}
          aria-controls="instructionsContent"
        >
          {isExpanded ? 'Свернуть' : 'Развернуть'}
        </button>
      </div>
      
      <div 
        id="instructionsContent" 
        className={`collapse ${isExpanded ? 'show' : ''}`}
      >
        <div className="card-body">
          <div className="row">
            <div className="col-md-6">
              <h5>Навигация по карте</h5>
              <ul className="list-group list-group-flush mb-4">
                <li className="list-group-item">
                  <i className="bi bi-mouse me-2"></i>
                  <strong>Перемещение:</strong> Удерживайте левую кнопку мыши и перетаскивайте карту
                </li>
                <li className="list-group-item">
                  <i className="bi bi-plus-circle me-2"></i>
                  <strong>Масштабирование:</strong> Используйте колесо мыши или кнопки "+" и "-" в левом верхнем углу карты
                </li>
                <li className="list-group-item">
                  <i className="bi bi-pin-map me-2"></i>
                  <strong>Просмотр объекта:</strong> Нажмите на маркер для получения информации об объекте
                </li>
                <li className="list-group-item">
                  <i className="bi bi-layers me-2"></i>
                  <strong>Кластеры:</strong> При отдалении маркеры группируются в кластеры с указанием количества объектов
                </li>
              </ul>
              
              <h5>Настройка тепловой карты</h5>
              <ul className="list-group list-group-flush mb-4">
                <li className="list-group-item">
                  <i className="bi bi-sliders me-2"></i>
                  <strong>Масштаб теплового слоя:</strong> Регулирует размер тепловых пятен (рекомендуемые значения: 0.1-0.5)
                </li>
                <li className="list-group-item">
                  <i className="bi bi-opacity me-2"></i>
                  <strong>Прозрачность:</strong> Регулирует видимость теплового слоя (рекомендуемые значения: 0.5-0.9)
                </li>
              </ul>
            </div>
            
            <div className="col-md-6">
              <h5>Использование фильтров</h5>
              <ul className="list-group list-group-flush mb-4">
                <li className="list-group-item">
                  <i className="bi bi-funnel me-2"></i>
                  <strong>Тип объекта:</strong> Выберите категорию объектов культурного наследия
                </li>
                <li className="list-group-item">
                  <i className="bi bi-geo-alt me-2"></i>
                  <strong>Регион:</strong> Введите название региона
                </li>
                <li className="list-group-item">
                  <i className="bi bi-award me-2"></i>
                  <strong>Уровень значения:</strong> Выберите статус объекта (федеральный, региональный и т.д.)
                </li>
                <li className="list-group-item">
                  <i className="bi bi-building me-2"></i>
                  <strong>Типология:</strong> Выберите специфическую категорию объекта
                </li>
                <li className="list-group-item">
                  <i className="bi bi-search me-2"></i>
                  <strong>Применение фильтров:</strong> Нажмите кнопку "Применить фильтры" после выбора параметров
                </li>
              </ul>
              
              <div className="alert alert-info">
                <h5 className="alert-heading">Совет</h5>
                <p className="mb-0">
                  Для наилучшего результата рекомендуется использовать комбинацию фильтров. 
                  Например, выберите тип объекта и регион, чтобы найти конкретные памятники в определенной области.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Instructions;