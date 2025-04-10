// Importamos los estilos del login
import './LoginScreen.css';

// Componente de pantalla de login, recibe onSwitch como prop para cambiar a registro
export default function LoginScreen({ onSwitch }) {
  // Función que se ejecuta cuando se envía el formulario
  const handleLogin = async (e) => {
    e.preventDefault(); // Prevenimos el comportamiento por defecto (recargar la página)

    const name = e.target.name.value; // Obtenemos el valor del input name
    const password = e.target.password.value; // Obtenemos el valor del input password

    // Hacemos una petición POST al backend para iniciar sesión
    const res = await fetch("http://localhost:8080/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, password }) // Enviamos los datos como JSON
    });

    if (res.ok) {
      const token = await res.text(); // Si fue bien, obtenemos el token como texto
      localStorage.setItem("jwt", token); // Lo guardamos en el localStorage
      alert("Login successful!"); // Mostramos mensaje de éxito
    } else {
      alert("Incorrect credentials"); // Si algo va mal, mostramos error
    }
  };

  // Devolvemos el formulario de login
  return (
    <div className="stadium-bg">
      <form className="login-panel" onSubmit={handleLogin}>
        {/* Campo de nombre */}
        <input name="name" type="text" placeholder="Name" />

        {/* Campo de contraseña */}
        <input name="password" type="password" placeholder="Password" />

        {/* Botón para enviar el formulario */}
        <button type="submit">LOG IN</button>

        {/* Texto clicable para ir al registro */}
        <p className="forgot" onClick={onSwitch}>
          Don't have an account? Register
        </p>
      </form>
    </div>
  );
}
