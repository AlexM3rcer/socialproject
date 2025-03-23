import React from 'react';
import Map from './Map';

function App() {
    return (
      <div className="container-fluid p-0">
        <header className="bg-dark text-white py-4">
          <div className="container">
            <h1 className="display-5">Объекты культурного наследия России</h1>
            <p className="lead">Исследуйте памятники истории и культуры народов Российской Федерации</p>
          </div>
        </header>
        
        <main className="container my-4">
          <div className="row">
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
        
        <footer className="bg-dark text-white py-3 mt-auto">
          <div className="container text-center">
            <p className="mb-0">© 2025 Культурное наследие России</p>
          </div>
        </footer>
      </div>
    );
  }
  
  export default App;