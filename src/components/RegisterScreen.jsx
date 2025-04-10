// Importamos los estilos del login
import './LoginScreen.css';

// Componente de pantalla de registro, recibe onSwitch como prop para volver al login
export default function RegisterScreen({ onSwitch }) {
  // Función que se ejecuta al enviar el formulario
  const handleRegister = async (e) => {
    e.preventDefault(); // Evitamos que se recargue la página

    const name = e.target.name.value; // Obtenemos el nombre del input
    const password = e.target.password.value; // Obtenemos la contraseña

    // Enviamos los datos al backend para registrar al usuario
    const res = await fetch("http://localhost:8080/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, password }) // Enviamos los datos como JSON
    });

    if (res.ok) {
      alert("Registration successful! You can now log in."); // Éxito
    } else {
      alert("Registration failed"); // Error
    }
  };

  // Devolvemos el formulario de registro
  return (
    <div className="stadium-bg">
      <form className="login-panel" onSubmit={handleRegister}>
        {/* Campo de nombre */}
        <input name="name" type="text" placeholder="Name" />

        {/* Campo de contraseña */}
        <input name="password" type="password" placeholder="Password" />

        {/* Botón para enviar el formulario */}
        <button type="submit">REGISTER</button>

        {/* Texto clicable para volver al login */}
        <p className="forgot" onClick={onSwitch}>
          Already have an account? Log in
        </p>
      </form>
    </div>
  );
}
