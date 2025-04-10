// Importamos los dos componentes principales: Login y Registro
import LoginScreen from './components/LoginScreen';
import RegisterScreen from './components/RegisterScreen';

// Importamos el hook useState para controlar si estamos en login o registro
import { useState } from 'react';

// Componente principal de la aplicación
export default function App() {
  // Estado que define si mostramos la pantalla de login (true) o de registro (false)
  const [isLogin, setIsLogin] = useState(true);

  return (
    <>
      {isLogin ? (
        // Si el estado es true, mostramos el LoginScreen
        // Le pasamos una función como prop para cambiar a la pantalla de registro
        <LoginScreen onSwitch={() => setIsLogin(false)} />
      ) : (
        // Si es false, mostramos RegisterScreen
        // Le pasamos una función como prop para volver al login
        <RegisterScreen onSwitch={() => setIsLogin(true)} />
      )}
    </>
  );
}
