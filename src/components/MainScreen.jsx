// Importamos los estilos para el fondo tipo estadio
import './MainScreen.css';

// Componente principal tras hacer login exitoso
export default function MainScreen() {
  return (
    <div className="stadium-bg"> {/* Fondo a pantalla completa con imagen */}
      <h1 style={{ color: "white" }}>Bienvenido al juego</h1> {/* Título temporal */}
    </div>
  );
}
