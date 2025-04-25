import { useEffect, useState } from 'react';
import './MainScreen.css';

export default function MainScreen({ onLogout }) {
  const [playerName, setPlayerName] = useState(''); // Estado para almacenar el nombre del jugador
  const [newPlayerName, setNewPlayerName] = useState(''); // Estado para almacenar el nombre del nuevo jugador
  const [nationality, setNationality] = useState(''); // Estado para almacenar la nacionalidad del nuevo jugador
  const [showCreatePlayerForm, setShowCreatePlayerForm] = useState(false); // Estado para controlar si se muestra el formulario de creación de jugador
  const [players, setPlayers] = useState([]); // Estado para almacenar la lista de jugadores
  const [loading, setLoading] = useState(false); // Estado para controlar si los jugadores están cargando

  useEffect(() => {
    // Intentamos obtener el token del localStorage
    const token = localStorage.getItem("jwt");
    if (token) {
      const base64Payload = token.split('.')[1]; // Obtenemos el payload del token (parte intermedia)
      const decodedPayload = JSON.parse(atob(base64Payload)); // Decodificamos el payload del token
      setPlayerName(decodedPayload.sub); // Extraemos el 'sub' (nombre del jugador) del payload y lo almacenamos en el estado
    }

    // Llamamos a la función para obtener los jugadores cuando el componente se monta
    fetchPlayers();
  }, []); // Se ejecuta una sola vez cuando el componente se monta

  const handleLogout = () => {
    // Función para manejar el cierre de sesión
    localStorage.removeItem("jwt"); // Eliminamos el token del localStorage
    onLogout(); // Llamamos a la función onLogout para cambiar el estado en App.js
  };

  const handleCreatePlayer = async () => {
    // Función para manejar la creación de un nuevo jugador
    const upperNationality = nationality.toUpperCase(); // Convertimos la nacionalidad a mayúsculas para garantizar consistencia
    const token = localStorage.getItem("jwt"); // Obtenemos el token del localStorage

    try {
      // Hacemos la petición POST para crear un nuevo jugador
      const response = await fetch('http://localhost:8080/player/create', {
        method: 'POST', // Método POST para crear un nuevo jugador
        headers: {
          'Content-Type': 'application/json', // Indicamos que estamos enviando JSON
         'Authorization': `Bearer ${token}`, // Pasamos el token en el encabezado de autorización
        },
        body: JSON.stringify({
          name: newPlayerName, // Nombre del nuevo jugador
          nationality: upperNationality, // Nacionalidad convertida a mayúsculas
        }),
      });

      if (response.ok) {
        alert('Player created successfully!'); // Mostramos un mensaje de éxito si el jugador fue creado correctamente
        setNewPlayerName(''); // Limpiamos el campo del nombre
        setNationality(''); // Limpiamos el campo de la nacionalidad
        setShowCreatePlayerForm(false); // Cerramos el formulario de creación de jugador
      } else {
        alert('Failed to create player'); // Mostramos un mensaje de error si no se pudo crear el jugador
      }
    } catch (error) {
      console.error('Error creating player:', error); // Registramos cualquier error en la consola
      alert('Error creating player'); // Mostramos un mensaje de error si ocurre una excepción
    }
  };

  const fetchPlayers = async () => {
    // Función para obtener los jugadores
    setLoading(true); // Establecemos el estado de carga a 'true'
    const token = localStorage.getItem("jwt"); // Obtenemos el token del localStorage

    try {
      // Hacemos una petición GET para obtener los jugadores
      const response = await fetch('http://localhost:8080/player/showAll', {
        method: 'GET', // Método GET para obtener la lista de jugadores
        headers: {
          'Authorization': `Bearer ${token}`, // Pasamos el token en el encabezado de autorización
        },
      });

      if (response.ok) {
        const playersData = await response.json(); // Parseamos la respuesta JSON
        setPlayers(playersData); // Guardamos los jugadores obtenidos en el estado
      } else {
        alert('Failed to fetch players'); // Mostramos un mensaje de error si la petición falla
      }
    } catch (error) {
      console.error('Error fetching players:', error); // Registramos el error en la consola
      alert('Error fetching players'); // Mostramos un mensaje de error si ocurre una excepción
    } finally {
      setLoading(false); // Establecemos el estado de carga a 'false' una vez que la operación termine
    }
  };

  return (
    <div className="stadium-bg"> {/* Fondo de la pantalla con imagen del estadio */}
      <div className="header"> {/* Cabecera con el nombre del jugador y los botones */}
        <span className="player-name">{playerName}</span> {/* Nombre del jugador */}
        <button className="logout-button" onClick={handleLogout}>Cerrar sesión</button> {/* Botón para cerrar sesión */}
        <button className="create-player-button" onClick={() => setShowCreatePlayerForm(true)}>Create Player</button> {/* Botón para mostrar el formulario de creación de jugador */}
      </div>

      {/* Formulario de creación de jugador */}
      {showCreatePlayerForm && (
        <div className="create-player-form">
          <h3>Create a New Player</h3> {/* Título del formulario */}
          <input
            type="text"
            placeholder="Player Name" // Campo para ingresar el nombre del jugador
            value={newPlayerName}
            onChange={(e) => setNewPlayerName(e.target.value)} // Actualiza el nombre del jugador en el estado
          />
          <input
            type="text"
            placeholder="Nationality" // Campo para ingresar la nacionalidad del jugador
            value={nationality}
            onChange={(e) => setNationality(e.target.value)} // Actualiza la nacionalidad en el estado
          />
          <button onClick={handleCreatePlayer}>Create Player</button> {/* Botón para crear el jugador */}
          <button onClick={() => setShowCreatePlayerForm(false)}>Cancel</button> {/* Botón para cancelar la creación */}
        </div>
      )}

      {/* Contenedor de jugadores */}
      {!showCreatePlayerForm && (
        <>
          <div className="players-list">
            {loading ? (
              <p>Loading players...</p> // Este es el mensaje mientras se están cargando los jugadores
            ) : (
              players.length > 0 ? (
                <div className="players-container">
                  {players.map((player, index) => (
                    <div className="player-card" key={index}>
                      <h4>{player.name}</h4>
                      <p><strong>Nationality:</strong> {player.nationality}</p>
                      <p><strong>Team:</strong> {player.team}</p>
                      <p><strong>Energy:</strong> {player.energy}</p>
                      <p><strong>Happiness:</strong> {player.happiness}</p>
                      <p><strong>State:</strong> {player.state || "N/A"}</p>
                      <p><strong>Mood:</strong> {player.mood || "N/A"}</p>
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
        </>
      )}
    </div>
  );
}