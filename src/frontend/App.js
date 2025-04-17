import React, { useState } from 'react';
import Map from './Map';
import Instructions from './Instructions';
import InfoGraphics from './InfoGraphics';

function App() {
    const [heritageObjects, setHeritageObjects] = useState([]);

    const updateHeritageObjects = (objects) => {
      setHeritageObjects(objects);
    };

    return (
      <div className="container-fluid p-0 d-flex flex-column min-vh-100" style={{backgroundColor: '#cbd1f6'}}>
        <header className="text-white py-4" style={{backgroundColor: '#493EFF'}}>
          <div className="container d-flex align-items-center">
            <svg width="5em" height="5em" fill="#FFFFFF" viewBox="0 0 50 50" className="me-5">
              <g id="SVGRepo_iconCarrier"><path d="M24.982422 2 A 1.0001 1.0001 0 0 0 24.535156 2.1132812L3.5351562 13.113281 A 1.0001 1.0001 0 0 0 3 14L3 17 A 1.0001 1.0001 0 0 0 4 18L5 18L5 19.400391C5 20.612292 5.8642937 21.645028 7 21.921875L7 40.011719L4.0996094 40.011719L4.265625 40.025391C3.0336039 39.818002 2 40.874696 2 42.03125L2 44.779297C2 45.959462 2.9340538 47 4.0996094 47L45.800781 47C46.966337 47 47.900391 46.037413 47.900391 44.880859L47.900391 42.132812C47.900391 40.976259 46.966337 40.011719 45.800781 40.011719L43 40.011719L43 21.921875C44.135706 21.645028 45 20.612292 45 19.400391L45 18L46 18 A 1.0001 1.0001 0 0 0 47 17L47 14 A 1.0001 1.0001 0 0 0 46.464844 13.113281L25.464844 2.1132812 A 1.0001 1.0001 0 0 0 24.982422 2 z M 25 4.1308594L45 14.605469L45 16L44.167969 16 A 1.0001 1.0001 0 0 0 43.841797 16L34.154297 16 A 1.0001 1.0001 0 0 0 33.984375 15.986328 A 1.0001 1.0001 0 0 0 33.839844 16L30.167969 16 A 1.0001 1.0001 0 0 0 29.841797 16L20.154297 16 A 1.0001 1.0001 0 0 0 19.984375 15.986328 A 1.0001 1.0001 0 0 0 19.839844 16L16.167969 16 A 1.0001 1.0001 0 0 0 15.841797 16L6.1542969 16 A 1.0001 1.0001 0 0 0 5.984375 15.986328 A 1.0001 1.0001 0 0 0 5.8398438 16L5 16L5 14.605469L25 4.1308594 z M 7 18L15 18L15 19.400391C15 19.781872 14.781872 20 14.400391 20L7.5996094 20C7.2181279 20 7 19.781872 7 19.400391L7 18 z M 17 18L19 18L19 19.400391C19 20.612292 19.864294 21.645028 21 21.921875L21 40.011719L15 40.011719L15 21.921875C16.135706 21.645028 17 20.612292 17 19.400391L17 18 z M 21 18L29 18L29 19.400391C29 19.781872 28.781872 20 28.400391 20L21.599609 20C21.218128 20 21 19.781872 21 19.400391L21 18 z M 31 18L33 18L33 19.400391C33 20.612292 33.864294 21.645028 35 21.921875L35 40.011719L29 40.011719L29 21.921875C30.135706 21.645028 31 20.612292 31 19.400391L31 18 z M 35 18L43 18L43 19.400391C43 19.781872 42.781872 20 42.400391 20L35.599609 20C35.218128 20 35 19.781872 35 19.400391L35 18 z M 9 22L13 22L13 40L9 40L9 22 z M 23 22L27 22L27 40L23 40L23 22 z M 37 22L41 22L41 40L37 40L37 22 z M 3.984375 42.003906 A 1.0001 1.0001 0 0 0 4.0996094 42.011719L45.800781 42.011719C45.835221 42.011719 45.900391 42.067369 45.900391 42.132812L45.900391 44.880859C45.900391 44.946308 45.835226 45 45.800781 45L4.0996094 45C4.0651649 45 4 45.023132 4 44.779297L4 42.03125C4 42.008135 3.9913337 42.007741 3.984375 42.003906 z"></path></g>
            </svg>
            <div>
              <h1 className="display-5">Объекты культурного наследия России</h1>
              <p className="lead">Исследуйте памятники истории и культуры народов Российской Федерации</p>
            </div>
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
                  <Map onDataUpdate={updateHeritageObjects} />
                </div>
              </div>
            </section>
            
            <section id="infographics" className="col-12">
              <div className="card shadow-sm">
                <div className="card-header bg-light">
                  <h2 className="h4 mb-0">Инфографика</h2>
                </div>
                <div className="card-body">
                  <InfoGraphics heritageObjects={heritageObjects} />
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