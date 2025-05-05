import { useEffect, useState, useCallback } from 'react';
import './MainScreen.css';

export default function MainScreen({ onLogout }) {
  const [playerName, setPlayerName] = useState('');
  const [newPlayerName, setNewPlayerName] = useState('');
  const [nationality, setNationality] = useState('');
  const [showCreatePlayerForm, setShowCreatePlayerForm] = useState(false);
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [playerDetails, setPlayerDetails] = useState(null);

  useEffect(() => {
    if (selectedPlayer) {
      const interval = setInterval(() => {
        fetchSelectedPlayerData(selectedPlayer);
      }, 60000);
      return () => clearInterval(interval);
    }
  }, [selectedPlayer]);

  useEffect(() => {
    const token = localStorage.getItem("jwt");
    if (token) {
      const base64Payload = token.split('.')[1];
      const decodedPayload = JSON.parse(atob(base64Payload));
      setPlayerName(decodedPayload.sub);
    }
    fetchPlayers();
  }, []);

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

  const handlePlayerClick = useCallback(async (playerId) => {
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
        setPlayerDetails(data);
        setSelectedPlayer(playerId);
      } else {
        alert('No se pudo cargar el jugador');
      }
    } catch (error) {
      console.error('Error cargando jugador:', error);
      alert('Error cargando jugador');
    }
  }, []);

  const fetchSelectedPlayerData = async (playerId) => {
    const token = localStorage.getItem("jwt");

    try {
      const response = await fetch(`http://localhost:8080/player/refresh/${playerId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setPlayerDetails(data);
      }
    } catch (error) {
      console.error('Error actualizando jugador:', error);
    }
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
        fetchPlayers();
      } else {
        alert('Failed to create player');
      }
    } catch (error) {
      console.error('Error creating player:', error);
      alert('Error creating player');
    }
  };

  const handleDeletePlayer = async () => {
    const token = localStorage.getItem("jwt");

    try {
      const response = await fetch(`http://localhost:8080/player/delete/${selectedPlayer}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        alert('Player deleted successfully!');
        setPlayerDetails(null);
        setSelectedPlayer(null);
        fetchPlayers();
      } else {
        alert('Failed to delete player');
      }
    } catch (error) {
      console.error('Error deleting player:', error);
      alert('Error deleting player');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("jwt");
    onLogout();
  };

  const getColor = (value) => {
    if (value <= 30) return 'red';
    if (value < 70) return 'dodgerblue';
    return 'limegreen';
  };

  return (
    <div className="stadium-bg">
      <div className="header">
        <span className="player-name">{playerName}</span>
        <button className="logout-button" onClick={handleLogout}>Log out</button>
        <button className="create-player-button" onClick={() => setShowCreatePlayerForm(true)}>Create Player</button>
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
        <div className="main-content">
          {playerDetails ? (
            <div className="player-details-table aligned-right">
              <h3>Detalles del jugador</h3>
              <table>
                <tbody>
                  <tr><td><strong>Name:</strong></td><td>{playerDetails.name}</td></tr>
                  <tr><td><strong>Nationality:</strong></td><td>{playerDetails.nationality}</td></tr>
                  <tr><td><strong>Team:</strong></td><td>{playerDetails.team}</td></tr>
                  <tr>
                    <td><strong>Energy:</strong></td>
                    <td>
                      <div className="bar-container">
                        <div
                          className="bar energy-bar"
                          style={{
                            width: `${playerDetails.energy}%`,
                            backgroundColor: getColor(playerDetails.energy)
                          }}
                        ></div>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td><strong>Happiness:</strong></td>
                    <td>
                      <div className="bar-container">
                        <div
                          className="bar happiness-bar"
                          style={{
                            width: `${playerDetails.happiness}%`,
                            backgroundColor: getColor(playerDetails.happiness)
                          }}
                        ></div>
                      </div>
                    </td>
                  </tr>
                  <tr><td><strong>Mood:</strong></td><td>{playerDetails.mood}</td></tr>
                  <tr><td><strong>Owner:</strong></td><td>{playerDetails.userName}</td></tr>
                </tbody>
              </table>
              <button
                className="back-button"
                onClick={() => {
                  setPlayerDetails(null);
                  setSelectedPlayer(null); // Detiene el intervalo
                }}
              >
                Back
              </button>
              <button className="delete-button" onClick={handleDeletePlayer}>Delete</button>
            </div>
          ) : (
            <div className="players-list">
              {loading ? (
                <p>Loading players...</p>
              ) : (
                players.length > 0 ? (
                  <div className="players-container">
                    {players.map((player, index) => (
                      <div
                        className={`player-card ${selectedPlayer === player.id ? 'selected' : ''}`}
                        key={index}
                        onClick={() => handlePlayerClick(player.id)}
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
                    <p>No tienes mascotas.</p>
                  </div>
                )
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
