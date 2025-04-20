import React, { useState, useEffect } from 'react';

const InfoGraphics = ({ heritageObjects }) => {
  const [selectedObject, setSelectedObject] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredObjects, setFilteredObjects] = useState([]);
  const itemsPerPage = 25;

  // Фильтруем объекты
  useEffect(() => {
    if (!heritageObjects) {
      setFilteredObjects([]);
      return;
    }

    if (searchTerm.trim() === '') {
      setFilteredObjects(heritageObjects);
    } else {
      const term = searchTerm.toLowerCase().trim();
      const filtered = heritageObjects.filter(
        object => 
          (object.name && object.name.toLowerCase().includes(term)) || 
          (object.address && object.address.toLowerCase().includes(term))
      );
      setFilteredObjects(filtered);
    }
    
    // Вовзращаемся к 1-ой странице
    setCurrentPage(1);
  }, [searchTerm, heritageObjects]);

  const handleObjectClick = (object) => {
    setSelectedObject(object);
  };

  const handleBackClick = () => {
    setSelectedObject(null);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleClearSearch = () => {
    setSearchTerm('');
  };

  if (!heritageObjects || heritageObjects.length === 0) {
    return (
      <div className="placeholder p-5 bg-light text-center rounded">
        Загрузка данных...
      </div>
    );
  }
    if (selectedObject) {
      return (
        <div className="object-details">
          <button 
            className="btn btn-sm btn-outline-secondary mb-3" 
            onClick={handleBackClick}
            style={{ borderColor: '#493EFF', color: '#493EFF' }}
          >
            ← Назад к списку
          </button>
          
          <div className="card">
            <div className="card-header text-white" style={{ backgroundColor: '#493EFF' }}>
              <h3 className="h5 mb-0">{selectedObject.name}</h3>
            </div>
            <div className="card-body">
              <img className="col-md-4" src={selectedObject.photo_url} alt={selectedObject.name} />
              <div className="row">
                <div className="col-md-12">
                  <p><strong style={{ color: '#493EFF' }}>Дата создания:</strong> {selectedObject.create_date || 'Не указано'}</p>
                  <p><strong style={{ color: '#493EFF' }}>Адрес:</strong> {selectedObject.address || 'Не указано'}</p>
                  <p><strong style={{ color: '#493EFF' }}>Тип объекта:</strong> {selectedObject.object_type_value || 'Не указано'}</p>
                  <p><strong style={{ color: '#493EFF' }}>Регион:</strong> {selectedObject.region_value || 'Не указано'}</p>
                  <p><strong style={{ color: '#493EFF' }}>Уровень значения:</strong> {selectedObject.significanceLevel || 'Не указано'}</p>
                  <p><strong style={{ color: '#493EFF' }}>Типология:</strong> {selectedObject.typology || 'Не указанао'}</p>
                  {selectedObject.security_info && (
                    <div className="mt-3">
                      <h4 className="h6" style={{ color: '#4966FF' }}>Описание:</h4>
                      <p>{selectedObject.security_info}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    // Считаем пагинацию
    const totalPages = Math.ceil(filteredObjects.length / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredObjects.slice(indexOfFirstItem, indexOfLastItem);

    // Меняем страницу
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
      <div className="heritage-objects-list">
        {/* Search bar */}
        <div className="mb-4">
          <div className="input-group">
            <span className="input-group-text" style={{ backgroundColor: '#493EFF', color: 'white' }}>
              <i className="bi bi-search"></i>
            </span>
            <input
              type="text"
              className="form-control"
              placeholder="Поиск по названию или адресу..."
              value={searchTerm}
              onChange={handleSearchChange}
              style={{ borderColor: '#493EFF' }}
            />
            {searchTerm && (
              <button 
                className="btn" 
                type="button"
                onClick={handleClearSearch}
                style={{ backgroundColor: '#4966FF', color: 'white', borderColor: '#4966FF' }}
              >
                ×
              </button>
            )}
          </div>
        </div>

        <div className="d-flex justify-content-between align-items-center mb-3">
          <p className="mb-0" style={{ color: '#493EFF' }}>
            {searchTerm ? 
              `Найдено объектов: ${filteredObjects.length} из ${heritageObjects.length}` : 
              `Всего объектов: ${heritageObjects.length}`
            }
          </p>
          {totalPages > 0 && (
            <p className="mb-0" style={{ color: '#493EFF' }}>
              Страница {currentPage} из {totalPages} 
              (показано {Math.min(currentItems.length, itemsPerPage)} из {filteredObjects.length})
            </p>
          )}
        </div>
        
        {filteredObjects.length > 0 ? (
          <div className="list-group mb-3">
            {currentItems.map((object, index) => (
              <button
                key={index}
                className="list-group-item list-group-item-action d-flex justify-content-between align-items-center"
                onClick={() => handleObjectClick(object)}
                style={{ borderColor: '#493EFF' }}
              >
                <div>
                  <h5 className="mb-1" style={{ color: '#493EFF' }}>{object.name}</h5>
                  <p className="mb-1 small" style={{ color: '#4966FF' }}>{object.address}</p>
                </div>
                <span className="badge rounded-pill" style={{ backgroundColor: '#4966FF', color: 'white' }}>
                  {object.object_type_value || 'Объект'}
                </span>
              </button>
            ))}
          </div>
        ) : (
          <div className="alert text-center" style={{ backgroundColor: '#493EFF', color: 'white' }}>
            {searchTerm ? 
              'По вашему запросу ничего не найдено. Попробуйте изменить параметры поиска.' : 
              'Нет доступных объектов для отображения.'
            }
          </div>
        )}
        
        {/* Pagination */}
        {totalPages > 1 && (
          <nav aria-label="Навигация по страницам">
            <ul className="pagination justify-content-center">
              <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                <button 
                  className="page-link" 
                  onClick={() => paginate(currentPage - 1)}
                  disabled={currentPage === 1}
                  style={{ color: '#493EFF', borderColor: '#493EFF' }}
                >
                  «
                </button>
              </li>
              
              {/* показываем номера страниц */}
              {[...Array(totalPages)].map((_, i) => {
                const pageNum = i + 1;
                // Показываем первую, последнюю и +-2 страницы
                if (
                  pageNum === 1 || 
                  pageNum === totalPages || 
                  (pageNum >= currentPage - 2 && pageNum <= currentPage + 2)
                ) {
                  return (
                    <li key={i} className={`page-item ${pageNum === currentPage ? 'active' : ''}`}>
                      <button 
                        className="page-link" 
                        onClick={() => paginate(pageNum)}
                        style={pageNum === currentPage ? 
                          { backgroundColor: '#493EFF', borderColor: '#493EFF', color: 'white' } : 
                          { color: '#493EFF', borderColor: '#493EFF' }
                        }
                      >
                        {pageNum}
                      </button>
                    </li>
                  );
                } else if (
                  (pageNum === currentPage - 3 && currentPage > 3) || 
                  (pageNum === currentPage + 3 && currentPage < totalPages - 2)
                ) {
                  return (
                    <li key={i} className="page-item disabled">
                      <span className="page-link" style={{ borderColor: '#493EFF' }}>...</span>
                    </li>
                  );
                }
                return null;
              })}
              
              <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                <button 
                  className="page-link" 
                  onClick={() => paginate(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  style={{ color: '#493EFF', borderColor: '#493EFF' }}
                >
                  »
                </button>
              </li>
            </ul>
          </nav>
        )}
      </div>
    );
  };
export default InfoGraphics;
