import { useState } from 'react';
import LoginScreen from './components/LoginScreen';
import RegisterScreen from './components/RegisterScreen';
import MainScreen from './components/MainScreen';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Estado para saber si el usuario está logueado
  const [isRegistering, setIsRegistering] = useState(false); // Estado para saber si estamos en la pantalla de registro

  // Función para manejar el cambio entre login y registro
  const toggleScreen = () => setIsRegistering(!isRegistering);

  // Función para manejar el cierre de sesión
  const handleLogout = () => {
    setIsLoggedIn(false); // Cambiamos el estado para mostrar el login
  };

  return (
    <div>
      {isLoggedIn ? (
        <MainScreen onLogout={handleLogout} />
      ) : isRegistering ? (
        <RegisterScreen onSwitch={toggleScreen} />
      ) : (
        <LoginScreen onLogin={() => setIsLoggedIn(true)} onSwitch={toggleScreen} />
      )}
    </div>
  );
}
