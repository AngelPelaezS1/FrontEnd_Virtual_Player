import { useEffect, useState } from 'react';
import './MainScreen.css';

export default function MainScreen({ onLogout }) {
  const [playerName, setPlayerName] = useState('');

  useEffect(() => {
    // Intentamos obtener el token del localStorage
    const token = localStorage.getItem("jwt");
    if (token) {
      try {
        // Dividimos el token en sus tres partes: header, payload y signature
        const base64Payload = token.split('.')[1];

        // Decodificamos la parte del payload
        const decodedPayload = JSON.parse(atob(base64Payload));

        // Aquí accedemos al 'subject' del token, que es el userName
        setPlayerName(decodedPayload.sub); // El 'sub' es el nombre del jugador (según el backend)
      } catch (error) {
        console.error('Error decoding token:', error);
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("jwt"); // Eliminar el token del localStorage
    onLogout(); // Llamamos a la función onLogout para cambiar el estado en App.js
  };

  return (
    <div className="stadium-bg">
      <div className="header">
        {/* Nombre del jugador en la parte superior izquierda */}
        <span className="player-name">{playerName}</span>
        {/* Botón de cerrar sesión */}
        <button className="logout-button" onClick={handleLogout}>Cerrar sesión</button>
      </div>
      {/* Aquí puedes agregar más contenido relacionado con el juego o el dashboard */}
    </div>
  );
}
