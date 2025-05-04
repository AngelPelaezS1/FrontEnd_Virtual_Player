import { useEffect, useState } from 'react';
import './MainScreen.css';

export default function MainScreen({ onLogout }) {
  const [playerName, setPlayerName] = useState(''); // Estado para almacenar el nombre del jugador
  const [newPlayerName, setNewPlayerName] = useState(''); // Estado para almacenar el nombre del nuevo jugador
  const [nationality, setNationality] = useState(''); // Estado para almacenar la nacionalidad del nuevo jugador
  const [showCreatePlayerForm, setShowCreatePlayerForm] = useState(false); // Estado para controlar si se muestra el formulario de creación de jugador
  const [players, setPlayers] = useState([]); // Estado para almacenar la lista de jugadores
  const [loading, setLoading] = useState(false); // Estado para controlar si los jugadores están cargando
  const [selectedPlayer, setSelectedPlayer] = useState(null); // Almacena el jugador clicado
  const [playerDetails, setPlayerDetails] = useState(null); // Detalles del jugador (para la tabla)

  useEffect(() => {
    const token = localStorage.getItem("jwt");
    if (token) {
      const base64Payload = token.split('.')[1];
      const decodedPayload = JSON.parse(atob(base64Payload));
      setPlayerName(decodedPayload.sub);
    }
    fetchPlayers();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("jwt");
    onLogout();
  };

  const handleCreatePlayer = async () => {
    const upperNationality = nationality.toUpperCase();
    const token = localStorage.getItem("jwt");

    try {
      const response = await fetch('http://localhost:8080/player/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: newPlayerName,
          nationality: upperNationality,
        }),
      });

      if (response.ok) {
        alert('Player created successfully!');
        setNewPlayerName('');
        setNationality('');
        setShowCreatePlayerForm(false);
        fetchPlayers(); // Recargamos los jugadores
      } else {
        alert('Failed to create player');
      }
    } catch (error) {
      console.error('Error creating player:', error);
      alert('Error creating player');
    }
  };

  const fetchPlayers = async () => {
    setLoading(true);
    const token = localStorage.getItem("jwt");

    try {
      const response = await fetch('http://localhost:8080/player/showAll', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const playersData = await response.json();
        setPlayers(playersData);
      } else {
        alert('Failed to fetch players');
      }
    } catch (error) {
      console.error('Error fetching players:', error);
      alert('Error fetching players');
    } finally {
      setLoading(false);
    }
  };

  // Función para manejar el clic sobre una tarjeta de jugador
  const handlePlayerClick = async (playerId) => {
    const token = localStorage.getItem("jwt");

    try {
      const response = await fetch(`http://localhost:8080/player/show/${playerId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setPlayerDetails(data); // Guardamos los detalles para mostrarlos
        setSelectedPlayer(playerId); // Marcamos el jugador seleccionado
      } else {
        alert('No se pudo cargar el jugador');
      }
    } catch (error) {
      console.error('Error cargando jugador:', error);
      alert('Error cargando jugador');
    }
  };

return (
  <div className="stadium-bg"> {/* Fondo de la pantalla con imagen del estadio */}
    <div className="header"> {/* Cabecera con el nombre del jugador y los botones */}
      <span className="player-name">{playerName}</span> {/* Nombre del jugador */}
      <button className="logout-button" onClick={handleLogout}>Log out</button> {/* Botón para cerrar sesión */}
      <button className="create-player-button" onClick={() => setShowCreatePlayerForm(true)}>Create Player</button> {/* Botón para crear jugador */}
    </div>

    {showCreatePlayerForm && (
      <div className="create-player-form">
        <h3>Create a New Player</h3>
        <input
          type="text"
          placeholder="Player Name"
          value={newPlayerName}
          onChange={(e) => setNewPlayerName(e.target.value)}
        />
        <select
          value={nationality}
          onChange={(e) => setNationality(e.target.value)}
          className="custom-select"
        >
          <option value="">Select nationality</option>
          <option value="ARGENTINA">Argentina</option>
          <option value="BRASIL">Brasil</option>
          <option value="ESPAÑA">España</option>
        </select>
        <button onClick={handleCreatePlayer}>Create Player</button>
        <button onClick={() => setShowCreatePlayerForm(false)}>Cancel</button>
      </div>
    )}

    {!showCreatePlayerForm && (
      <>
        {/* Contenido principal: mostramos tabla si hay jugador clicado, si no la lista */}
        <div className="main-content"> {/* Contenedor principal siempre empujado a la derecha */}
          {playerDetails ? (
            <div className="player-details-table aligned-right"> {/* Tabla alineada a la derecha */}
              <h3>Detalles del jugador</h3>
              <table>
                <tbody>
                  <tr><td><strong>Nombre:</strong></td><td>{playerDetails.name}</td></tr>
                  <tr><td><strong>Nacionalidad:</strong></td><td>{playerDetails.nationality}</td></tr>
                  <tr><td><strong>Equipo:</strong></td><td>{playerDetails.team}</td></tr>
                  <tr><td><strong>Energía:</strong></td><td>{playerDetails.energy}</td></tr>
                  <tr><td><strong>Felicidad:</strong></td><td>{playerDetails.happiness}</td></tr>
                  <tr><td><strong>Estado:</strong></td><td>{playerDetails.state}</td></tr>
                  <tr><td><strong>Ánimo:</strong></td><td>{playerDetails.mood}</td></tr>
                  <tr><td><strong>Propietario:</strong></td><td>{playerDetails.userName}</td></tr>
                </tbody>
              </table>
              <button className="back-button" onClick={() => setPlayerDetails(null)}>Volver</button> {/* Botón para volver a la lista */}
            </div>
          ) : (
            <div className="players-list"> {/* Contenedor de jugadores */}
              {loading ? (
                <p>Loading players...</p> // Este es el mensaje mientras se están cargando los jugadores
              ) : (
                players.length > 0 ? (
                  <div className="players-container">
                    {players.map((player, index) => (
                      <div
                        className={`player-card ${selectedPlayer === player.id ? 'selected' : ''}`}
                        key={index}
                        onClick={() => handlePlayerClick(player.id)} // Clic para mostrar detalles
                      >
                        <h4>{player.name}</h4>
                        <p><strong>Nationality:</strong> {player.nationality}</p>
                        <p><strong>Team:</strong> {player.team}</p>
                        <p><strong>Owner:</strong> {player.userName}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="no-players-panel">
                    <p>No tienes mascotas.</p> {/* Mensaje cuando no hay jugadores */}
                  </div>
                )
              )}
            </div>
          )}
        </div>
      </>
    )}
  </div>
);
}