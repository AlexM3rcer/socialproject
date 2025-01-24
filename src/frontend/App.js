import React from 'react';
import Map from './Map';

function App() {
    return (
      <div className="App">
        <header className="App-header">
          <h1>Объекты культурного наследия России</h1>
          <p>Исследуйте памятники истории и культуры народов Российской Федерации</p>
        </header>
        <main>
          <section id="heatmap">
            <div className="placeholder">
              <Map />   
            </div>
          </section>
          <section id="infographics">
            {/* Здесь будет инфографика */}
            <div className="placeholder">Инфографика будет здесь</div>
          </section>
        </main>
        <footer>
          <p>© 2025 Культурное наследие России</p>
        </footer>
      </div>
    );
  }
  
  export default App;