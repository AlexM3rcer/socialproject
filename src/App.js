import React from 'react';

function App() {
    return (
      <div className="App">
        <header className="App-header">
          <h1>Объекты культурного наследия России</h1>
          <p>Исследуйте памятники истории и культуры народов Российской Федерации</p>
        </header>
        <main>
          <section id="heatmap">
            {/* Здесь будет тепловая карта */}
            <div className="placeholder">Тепловая карта будет здесь</div>
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