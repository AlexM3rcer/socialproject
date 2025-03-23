import React from 'react';
import Map from './Map';
import Instructions from './Instructions';

function App() {
    return (
      <div className="container-fluid p-0 d-flex flex-column min-vh-100">
        <header className="bg-dark text-white py-4">
          <div className="container">
            <h1 className="display-5">Объекты культурного наследия России</h1>
            <p className="lead">Исследуйте памятники истории и культуры народов Российской Федерации</p>
          </div>
        </header>
        
        <main className="container my-4 flex-grow-1">
          <div className="row">
            {/* Инструкция по использованию */}
            <section className="col-12">
              <Instructions />
            </section>
            
            <section id="heatmap" className="col-12 mb-4">
              <div className="card shadow-sm">
                <div className="card-header bg-light">
                  <h2 className="h4 mb-0">Карта объектов</h2>
                </div>
                <div className="card-body">
                  <Map />
                </div>
              </div>
            </section>
            
            <section id="infographics" className="col-12">
              <div className="card shadow-sm">
                <div className="card-header bg-light">
                  <h2 className="h4 mb-0">Инфографика</h2>
                </div>
                <div className="card-body">
                  <div className="placeholder p-5 bg-light text-center rounded">
                    Инфографика будет здесь
                  </div>
                </div>
              </div>
            </section>
          </div>
        </main>
        
        <footer className="bg-dark text-white py-4 mt-auto">
          <div className="container">
            <div className="row">
              <div className="col-md-8">
                <h5>Условия использования данных</h5>
                <p className="small">
                  Информация об объектах культурного наследия предоставлена на основе открытых данных 
                  Министерства культуры Российской Федерации. При использовании материалов обязательна 
                  ссылка на Портал открытых данных Министерства культуры России как на источник информации.
                </p>
                <p className="small">
                  Данные предоставляются по принципу "как есть" (as is). Министерство культуры РФ не несет 
                  ответственности за решения, принятые на основании предоставленных данных, или за потери, 
                  которые могут возникнуть в результате использования данных.
                </p>
              </div>
              <div className="col-md-4 text-md-end">
                <p className="mb-1">
                  <a href="https://opendata.mkrf.ru/" className="text-white" target="_blank" rel="noopener noreferrer">
                    Портал открытых данных Минкультуры России
                  </a>
                </p>
                <p className="mb-0">© 2025 Культурное наследие России</p>
              </div>
            </div>
          </div>
        </footer>
      </div>
    );
  }
  
  export default App;