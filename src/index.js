// Importamos React
import React from 'react';
// Importamos ReactDOM
import ReactDOM from 'react-dom/client';
// Importamos el componente principal App
import App from './App';

// Creamos el punto de entrada a la aplicación
const root = ReactDOM.createRoot(document.getElementById('root'));

// Renderizamos el componente App dentro del StrictMode
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
